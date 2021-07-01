import Request from "../Request";

export default class RCommentsCreate extends Request {
  constructor(id, text, parentCommentId = 0, imageArray = null,
              gif = null, watchPost = false, quoteId = 0, stickerId = 0) {
    super("RCommentsCreate");
    this.unitId = id;
    this.text = text;
    this.parentCommentId = parentCommentId;
    this.watchPost = watchPost;
    this.quoteId = quoteId;
    this.stickerId = stickerId;
  }
}
