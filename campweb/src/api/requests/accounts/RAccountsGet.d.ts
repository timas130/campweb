import Request from "../Request";
import {Account} from "../../ApiContext";

declare interface RAccountsGetResponse {
  account: Account
}

export default class RAccountsGet extends Request<RAccountsGetResponse> {
  constructor(id: number | null, name: string | null);
}
