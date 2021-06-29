import Request from "../Request";

export default class RPostFeedGetAllSubscribe extends Request {
  constructor(offsetDate, categoryId) {
    super("RPostFeedGetAllSubscribe");
    this.offsetDate = offsetDate || 0;
    this.categoryId = categoryId || 0;
  }
}
