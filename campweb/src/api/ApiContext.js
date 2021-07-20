import React from "react";
import md5 from "md5";
import API from "./api.json";

export const ApiContext = React.createContext(null);
const apiVersion = "1.251";
const projectKey = API["PROJECT_KEY_CAMPFIRE"];
export const protoadmins = [1];

export const proxyAddr =
  process.env.NODE_ENV === "production" ?
  "https://campweb-proxy.herokuapp.com/" :
  "http://192.168.1.104:8080/";

export class ApiClient {
  constructor() {
    this.loginToken = (window.localStorage && window.localStorage.getItem("loginToken")) || "";
    this.accessToken = "";
    this.loginInfo = null;

    this.onUnauthorized = null;
    this.onError = null;
  }

  setLoginTokenEmail(email, password) {
    this.loginToken = `Email - ${email} - ${md5(password)}`;
    window.localStorage && window.localStorage.setItem("loginToken", this.loginToken);
  }
  clearLoginToken() {
    this.loginToken = "";
    window.localStorage && window.localStorage.setItem("loginToken", "");
  }

  translate(id) {
    let idx = this.loginInfo.translate_map_k.indexOf(id);
    if (idx === -1) return id;
    else return this.loginInfo.translate_map_v[idx].text;
  }

  makeRequest(req) {
    // prepare
    req["J_REQUEST_DATE"] = new Date().getTime() * 1000000;
    if (req["J_REQUEST_NAME"] === "RAccountsLogin" && this.loginToken)
      req["J_API_LOGIN_TOKEN"] = this.loginToken;
    if (this.accessToken && !req["__media__"]) req["J_API_ACCESS_TOKEN"] = this.accessToken;
    req["J_API_REFRESH_TOKEN"] = "";
    req["requestApiVersion"] = req["__media__"] ? "1" : apiVersion;
    req["requestProjectKey"] = projectKey;

    // send
    return new Promise(async (resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", proxyAddr, true);
      if (req["__type__"] === "binary") {
        xhr.responseType = "blob";
      }

      xhr.onload = () => {
        console.log(`[${req["J_REQUEST_NAME"]}] got response`);

        if (req["__type__"] === "binary") {
          resolve(xhr.response);
          return;
        }

        let data;
        try {
          data = JSON.parse(xhr.responseText)
        } catch (e) {
          reject("Failed to parse response");
          return;
        }
        if (data["__proxy_error__"]) {
          reject("Proxy error: " + data["__proxy_error__"]);
          this.onError && this.onError("Proxy error: " + data["__proxy_error__"]);
          return;
        }
        if (data["J_API_ACCESS_TOKEN"]) {
          this.accessToken = data["J_API_ACCESS_TOKEN"];
        }
        if (data["J_STATUS"] === "J_STATUS_OK") {
          if (req["J_REQUEST_NAME"] === "RAccountsLogin") {
            this.loginInfo = data["J_RESPONSE"];
            this.loginInfo.translate_map_k = JSON.parse(this.loginInfo.translate_map_k);
            this.loginInfo.translate_map_v = JSON.parse(this.loginInfo.translate_map_v);
          }
          resolve(data["J_RESPONSE"] || {});
        } else {
          reject("Server responded with an error: " + (data["J_RESPONSE"].code || "[unknown]"));
          if (data["J_RESPONSE"].code === "CODE_UNAUTHORIZED") {
            this.onUnauthorized && this.onUnauthorized();
          } else {
            this.onError && this.onError("Server responded with an error: " + (data["J_RESPONSE"].code || "[unknown]"));
          }
        }
      };
      xhr.onerror = (ev) => {
        reject("Request error");
        this.onError && this.onError("Unknown request error");
      };

      let reqClone = Object.assign({}, req);
      reqClone["__media__"] = undefined;
      reqClone["__type__"] = undefined;
      reqClone["__data__"] = undefined;

      const jsonPayload = JSON.stringify(reqClone);
      console.log(`[${req["J_REQUEST_NAME"]}] sending token_present=${!!this.accessToken}`);
      xhr.send(new Blob([
        new TextEncoder().encode(jsonPayload).length.toString() + ":", // json length
        req["__media__"] ? "__proxy__(media):" : "", // media prefix
        jsonPayload,
        ...req["__data__"]
      ]));
    });
  }
}
