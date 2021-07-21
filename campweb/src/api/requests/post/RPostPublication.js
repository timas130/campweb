import Request from "../Request";

export default class RPostPublication extends Request {
  constructor(id, tags, comment, notifyFollowers, pendingTime, closed, multilingual,
              rubricId, userActivityId, userActivityNextUserId) {
    super("RPostPublication");
    this.unitId = id;
    this.tags = JSON.stringify(tags);
    this.comment = comment;
    this.notifyFollowers = notifyFollowers;
    this.pendingTime = pendingTime;
    this.closed = closed;
    this.multilingual = multilingual;
    this.rubricId = rubricId;
    this.userActivityId = userActivityId;
    this.userActivityNextUserId = userActivityNextUserId;
  }
}
