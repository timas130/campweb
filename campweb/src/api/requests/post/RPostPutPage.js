import Request from "../Request";
import API from "../../api.json";

export default class RPostPutPage extends Request {
  constructor(id, fandomId, pages) {
    super("RPostPutPage");
    this.unitId = id;
    this.fandomId = fandomId;
    this.appKey = "";
    this.appSubKey = "";
    this.pages = JSON.stringify(pages);
    this.languageId = API["LANGUAGE_RU"];
  }
}
