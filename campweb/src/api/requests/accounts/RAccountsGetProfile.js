import Request from "../Request";

export default class RAccountsGetProfile extends Request {
  constructor(id, name = "") {
    super("RAccountsGetProfile");
    this.accountId = id;
    this.accountName = name;
  }
}
