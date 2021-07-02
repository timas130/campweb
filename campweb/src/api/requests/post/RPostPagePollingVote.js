import Request from "../Request";
import API from "../../api.json";

export default class RPostPagePollingVote extends Request {
  constructor(sourceId, pollingId, itemId, sourceType = API["PAGES_SOURCE_TYPE_POST"], sourceIdSub = 0) {
    super("RPostPagePollingVote");
    this.sourceId = sourceId;
    this.pollingId = pollingId;
    this.itemId = itemId;
    this.sourceId = sourceId;
    this.sourceIdSub = sourceIdSub;
  }
}
