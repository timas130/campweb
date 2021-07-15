import Request from "../Request";

declare interface RAccountsGetProfileResponse {
  age: number,
  banDate: number,
  bansCount: number,
  blockAccountsCount: number,
  blackFandomsCount: number,
  dateCreate: number,
  description: string,
  followersCount: number,
  followsCount: number,
  isFollow: boolean,
  karmaTotal: number,
  links: {links: string},
  moderationFandomsCount: number,
  note: string,
  pinnedPost: any | null,
  rates: number,
  status: string,
  stickersCount: number,
  subscribedFandomsCount: number,
  titleImageGifId: number,
  titleImageId: number,
  warnsCount: number
}

export default class RAccountsGetProfile extends Request<RAccountsGetProfileResponse> {
  constructor(id: number, name?: string);
}
