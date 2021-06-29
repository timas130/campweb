import Request from "../Request";

export default class RPublicationsKarmaAdd extends Request {
  constructor(id, up = true, anon = false, userLanguage = 2) {
    super("RPublicationsKarmaAdd");
    this.unitId = id;
    this.up = up;
    this.anon = anon;
    this.userLanguage = userLanguage;
  }
}
