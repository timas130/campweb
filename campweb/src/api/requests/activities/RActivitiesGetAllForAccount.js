import Request from "../Request";

export default class RActivitiesGetAllForAccount extends Request {
  constructor(accountId, fandomId, language, offset) {
    super("RActivitiesGetAllForAccount");
    this.accountId = accountId;
    this.fandomId = fandomId;
    this.languageId = language;
    this.offset = offset;
  }
}
