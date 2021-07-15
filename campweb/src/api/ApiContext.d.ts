import Request from "./requests/Request";
import {Context} from "react";

declare interface TranslateMapV {
  hint: string,
  key: string,
  languageId: number,
  projectKey: string,
  text: string
}

declare type SexMale = 0;
declare type SexFemale = 1;
declare type Sex = SexMale | SexFemale;

declare interface Account {
  J_DATE_CREATE: number,
  J_ID: number,
  J_IMAGE_ID: number,
  J_LAST_ONLINE_DATE: number,
  J_LVL: number,
  J_NAME: string,
  accountEffects: string,
  karma30: number,
  sex: Sex,
  sponsor: number,
  sponsorTimes: number
}

declare interface LoginInfo {
  translate_map_k: string[],
  translate_map_v: TranslateMapV[],
  account: Account,
  settings: object
}

declare class ApiClient {
  constructor();

  loginToken: string;
  accessToken: string;

  loginInfo: LoginInfo | null;
  onError: (error: any) => void;
  onUnauthorized: () => void;

  setLoginTokenEmail(email: string, password: string): void;
  clearLoginToken(): void;

  translate(id: string): string;

  makeRequest<T>(req: Request<T>): T;
}

declare const ApiContext: Context<ApiClient>;
declare const protoadmins: number[];
