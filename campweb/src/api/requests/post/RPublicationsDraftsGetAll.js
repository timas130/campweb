import Request from "../Request";

export const amount = 5;

export default class RPublicationsDraftsGetAll extends Request {
  constructor(offset, fandomId) {
    super("RPublicationsDraftsGetAll");
    this.fandomId = fandomId;
    this.projectKey = "";
    this.projectSubKey = "";
    this.offset = offset;
  }
}
