import Request from "../Request";

export const count = 20;

export default class RRubricsGetAll extends Request {
  constructor(fandom, language, owner, offset) {
    super("RRubricsGetAll");
    this.fandomId = fandom;
    this.languageId = language;
    this.ownerId = owner;
    this.offset = offset;
  }
}
