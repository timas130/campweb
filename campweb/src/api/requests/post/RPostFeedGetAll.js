import Request from "../Request";

export default class RPostFeedGetAll extends Request {
  constructor(offsetDate, languagesId, categoriesId, importantOnly, karmaCategory, noSubscribes, noKarmaCategory) {
    super("RPostFeedGetAll");
    this.offsetDate = offsetDate || 0;
    this.languagesId = languagesId || [2];
    this.categoriesId = categoriesId || [1, 100];
    this.importantOnly = importantOnly || false;
    this.karmaCategory = karmaCategory || 0;
    this.noSubscribes = noSubscribes || false;
    this.noKarmaCategory = noKarmaCategory || false;
  }
}
