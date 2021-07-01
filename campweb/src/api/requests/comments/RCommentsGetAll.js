import Request from "../Request";

export const count = 50;

export default class RCommentsGetAll extends Request {
  constructor(id, offsetDate, old, startFromBottom) {
    super("RCommentsGetAll");
    this.unitId = id;
    this.offsetDate = offsetDate;
    this.old = old;
    this.startFromBottom = startFromBottom;
  }
}
