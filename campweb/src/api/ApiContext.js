import React from "react";
import md5 from "md5";

export const ApiContext = React.createContext(null);
export const apiVersion = "1.251";
export const projectKey = "Campfire";

export const proxyAddr =
  process.env.NODE_ENV === "production" ?
  "wss://campweb-proxy.herokuapp.com/" :
  "ws://192.168.1.104:8080/";

export const languageEn = 1;
export const languageRu = 2;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class ApiClient {
  constructor() {
    let lockResolve;
    this.endPromise = new Promise((resolve, reject) => {
      lockResolve = () => {
        this.endPromise = null;
        resolve();
      };
    });
    this.queue = [];

    this.ws = new WebSocket(proxyAddr);
    this.ws.onclose = () => this.reconnect();
    this.ws.onerror = () => this.reconnect();
    this.ws.onopen = lockResolve;

    this.loginToken = window.localStorage.getItem("loginToken") || "";
    this.accessToken = "";
    this.loginInfo = null;

    this.onUnauthorized = null;
    this.onError = null;
  }

  reconnect() {
    this.ws.close();
    this.ws = new WebSocket(proxyAddr);
    this.ws.onerror = () => {
      console.error("failed to reconnect");
    };
    this.ws.onclose = () => {
      console.error("failed to reconnect");
    };
    setTimeout(() => {
      this.ws.onclose = () => this.reconnect();
      this.ws.onerror = () => this.reconnect();
      console.log("reconnected (probably lol)");
    }, 1000);
  }

  setLoginTokenEmail(email, password) {
    this.loginToken = `Email - ${email} - ${md5(password)}`;
    window.localStorage.setItem("loginToken", this.loginToken);
  }
  setAccessToken(token) {
    this.accessToken = token;
  }
  setOnUnauthorized(onUnauthorized) {
    this.onUnauthorized = onUnauthorized;
  }

  makeRequest(req) {
    console.log(`[${req["J_REQUEST_NAME"]}] start token=${!!this.accessToken}`);

    // prepare
    req["J_REQUEST_DATE"] = new Date().getTime() * 1000000;
    if (this.loginToken && !req["__media__"]) req["J_API_LOGIN_TOKEN"] = this.loginToken;
    if (this.accessToken && !req["__media__"]) req["J_API_ACCESS_TOKEN"] = this.accessToken;
    req["J_API_REFRESH_TOKEN"] = "";
    req["requestApiVersion"] = req["__media__"] ? "1" : apiVersion;
    req["requestProjectKey"] = projectKey;

    // send
    return new Promise(async (resolve, rejectInner) => {
      const reject = (function (e) {
        this.onError && this.onError(e);
        rejectInner(e);
      }).bind(this);

      // add to queue
      let id = Math.max(...this.queue);
      if (id === -Infinity) id = 0;
      id++;
      this.queue.push(id);

      // wait
      console.log(`[${req["J_REQUEST_NAME"]}] queue id ${id}, waiting`);
      while (this.queue[0] !== id || this.endPromise) {
        this.endPromise && await this.endPromise;
        await sleep(50);
      }

      // leave queue
      this.queue.shift();
      console.log(`[${req["J_REQUEST_NAME"]}] queue id ${id}, starting request`);

      let lockResolve;
      this.endPromise = new Promise((resolve, reject) => {
        lockResolve = () => {
          this.endPromise = null;
          resolve();
        };
      });

      this.ws.onmessage = (ev) => {
        this.ws.onmessage = undefined;
        this.ws.onclose = () => this.reconnect();
        this.ws.onerror = () => this.reconnect();

        if (req["__proxy_error__"]) {
          reject("Proxy error: " + req["__proxy_error__"]);
          lockResolve();
          return;
        }
        if (req["__type__"] === "binary") {
          resolve(ev.data);
          lockResolve();
          return;
        }

        let data;
        try {
          data = JSON.parse(ev.data)
        } catch (e) {
          reject("Failed to parse response");
          lockResolve();
          return;
        }
        if (data["J_API_ACCESS_TOKEN"]) {
          this.setAccessToken(data["J_API_ACCESS_TOKEN"]);
        }
        if (data["J_STATUS"] === "J_STATUS_OK") {
          if (req["J_REQUEST_NAME"] === "RAccountsLogin") {
            this.loginInfo = data["J_RESPONSE"];
          }
          resolve(data["J_RESPONSE"] || {});
        } else {
          reject("Server responded with an error: " + (data["J_RESPONSE"].code || "[unknown]"));
          if (data["J_RESPONSE"].code === "CODE_UNAUTHORIZED") {
            this.onUnauthorized && this.onUnauthorized();
          }
        }
        lockResolve();
      };
      this.ws.onclose = (ev) => {
        reject("Server closed connection, reconnecting");
        lockResolve();
        this.reconnect();
      };
      this.ws.onerror = (ev) => {
        reject("WebSocket error, reconnecting");
        lockResolve();
        this.reconnect();
      };

      let payload;
      if (req["__media__"]) {
        payload = "__proxy__(media):" + JSON.stringify(req);
      } else {
        payload = JSON.stringify(req);
      }
      
      console.log(`[${req["J_REQUEST_NAME"]}] queue id ${id}, sending request`);
      if (process.env.NODE_ENV === "development")
        console.log(payload.replace(this.accessToken, "...").replace(this.loginToken, "..."));
      this.ws.send(payload);
    });
  }
}
