import Request from "../Request";

export default class RActivitiesRelayRaceMember extends Request {
  constructor(id, member) {
    super("RActivitiesRelayRaceMember");
    this.activityId = id;
    this.member = member;
  }
}
