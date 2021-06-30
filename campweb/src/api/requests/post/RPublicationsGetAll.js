import Request from "../Request";
import API from "../../api.json";

export const orderNew = 1;
export const orderOld = 2;
export const orderKarma = 3;
export const orderDownloads = 4;

export default class RPublicationsGetAll extends Request {
  constructor(types, offset = 0) {
    super("RPublicationsGetAll");
    this.appKey = null;
    this.appSubKey = null;
    this.accountId = 0;
    this.count = 20;
    this.drafts = false;
    this.fandomId = 0;
    this.fandomsIds = [];
    this.important = API["PUBLICATION_IMPORTANT_NONE"];
    this.includeModerationsBlocks = true;
    this.includeModerationsOther = true;
    this.includeMultilingual = false;
    this.includeZeroLanguages = false;
    this.languageId = 0;
    this.offset = offset;
    this.onlyWithFandom = false;
    this.order = orderNew;
    this.parentUnitId = 0;
    this.unitTypes = types;
    this.tags = null;
  }
}
