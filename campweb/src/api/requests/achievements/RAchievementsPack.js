import Request from "../Request";

export default class RAchievementsPack extends Request {
  constructor(accountId, packIndex) {
    super("RAchievementsPack");
    this.accountId = accountId;
    this.packIndex = packIndex;
  }
}
