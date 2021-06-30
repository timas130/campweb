import Request from "../Request";

export default class RAccountsGet extends Request {
  constructor(id, name = "") {
    super("RAccountsGet");
    this.accountId = id;
    this.accountName = name;
  }
}
