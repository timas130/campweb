import Request from "../Request";

export default class RPostPagePollingGet extends Request {
  constructor(id) {
    super("RPostPagePollingGet");
    this.pollingId = id;
  }
}
