import Request from "../Request";

export const count = 20;

export default class RAccountsKarmaInFandomsGetAll extends Request {
  constructor(id, offset = 0) {
    super("RAccountsKarmaInFandomsGetAll");
    this.accountId = id;
    this.offset = offset;
  }
}
