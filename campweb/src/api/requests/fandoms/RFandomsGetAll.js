import Request from "../Request";

export const subscribeNone = 0;
export const subscribeYes = 1;
export const subscribeNo = 2;
export const count = 20;

export default class RFandomsGetAll extends Request {
  constructor(subscribedStatus, offset, languageId = 2, categoryId = 0, name = "") {
    super("RFandomsGetAll");
    this.subscribedStatus = subscribedStatus;
    this.offset = offset;
    this.languageId = languageId;
    this.categoryId = categoryId;
    this.name = name;
    this.params1 = "[]";
    this.params2 = "[]";
    this.params3 = "[]";
    this.params4 = "[]";
  }
}
