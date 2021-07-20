import Request from "../Request";

export default class RPostGetDraft extends Request {
  constructor(id) {
    super("RPostGetDraft");
    this.unitId = id;
  }
}
