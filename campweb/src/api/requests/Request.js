export default class Request {
  constructor(name) {
    this["J_REQUEST_NAME"] = name;
    this["__type__"] = "json";
    this["__media__"] = false;
  }
  setType(type) {
    this["__type__"] = type;
  }
  setMedia(media) {
    this["__media__"] = media;
  }
}
