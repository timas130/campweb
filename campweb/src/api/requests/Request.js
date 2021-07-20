export default class Request {
  constructor(name) {
    this["J_REQUEST_NAME"] = name;
    this["__type__"] = "json";
    this["__media__"] = false;
    this["__data__"] = [];
  }
  setType(type) {
    this["__type__"] = type;
  }
  setMedia(media) {
    this["__media__"] = media;
  }
  addDataOutput(blob) {
    if (this.dataOutput) {
      this.dataOutput = JSON.stringify([...JSON.parse(this.dataOutput), blob.size]);
    } else {
      this.dataOutput = JSON.stringify([blob.size]);
    }
    this["__data__"].push(blob);
  }
}
