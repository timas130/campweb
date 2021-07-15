declare type RequestType = "binary" | "json";

export default class Request<T> {
  J_REQUEST_NAME: string;
  type: RequestType;
  media: boolean;

  constructor(name: string);
  setType(type: RequestType);
  setMedia(media: boolean);
}
