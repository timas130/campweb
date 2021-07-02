import Request from "../Request";

export default class RAchievementsInfo extends Request {
  constructor(id) {
    super("RAchievementsInfo");
    this.accountId = id;
  }
}