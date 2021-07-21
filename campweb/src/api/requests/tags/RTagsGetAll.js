import Request from "../Request";

export default class RTagsGetAll extends Request {
  constructor(fandom, language) {
    super("RTagsGetAll");
    this.fandomId = fandom;
    this.languageId = language;
  }
}