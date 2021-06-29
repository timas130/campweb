import Request from "../Request";

export default class RAccountsLogin extends Request {
  constructor(languageId, tokenNotification) {
    super("RAccountsLogin");
    this.languageId = languageId;
    this.tokenNotification = tokenNotification || "";
  }
}