import Request from "../Request";

export default class RPostChangePage extends Request {
  constructor(id, page, pageIndex) {
    super("RPostChangePage");
    this.unitId = id;
    this.page = page;
    this.pageIndex = pageIndex;
  }
}
