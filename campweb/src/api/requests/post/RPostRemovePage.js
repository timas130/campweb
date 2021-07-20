import Request from "../Request";

export default class RPostRemovePage extends Request {
  constructor(id, indexes) {
    super("RPostRemovePage");
    this.unitId = id;
    this.pageIndexes = indexes;
  }
}
