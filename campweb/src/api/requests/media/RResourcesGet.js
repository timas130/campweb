import Request from "../Request";

export default class RResourcesGet extends Request {
  constructor(id) {
    super("RResourcesGet");
    this.setType("binary");
    this.setMedia(true);
    this.resourceId = id;
  }
}
