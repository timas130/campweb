import Request from "../Request";

export default class RPostGet extends Request {
  constructor(id) {
    super("RPostGet");
    this.unitId = id;
  }
}
