import Request from "../Request";

export default class RResourcesPut extends Request {
  constructor(resourceId, publicationId, tag, resource) {
    super("RResourcesPut");
    this.setType("binary");
    this.setMedia(true);
  }
}
