import { List, CircularProgress, TextField, Box, IconButton } from "@material-ui/core";
import { useContext, useState } from "react";
import InView from "react-intersection-observer";
import { ApiContext } from "../api/ApiContext";
import Comment from "./Comment";
import RCommentsGetAll, { count as commentCount } from "../api/requests/comments/RCommentsGetAll";
import { AttachFile, Send } from "@material-ui/icons";
import RCommentsCreate from "../api/requests/comments/RCommentsCreate";

function Comments(props) {
  const apiClient = useContext(ApiContext);
  const [loaderShow, setLoaderShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

  const [postedComments, setPostedComments] = useState([]);
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState(null);

  const onCommentsShown = async (inView) => {
    if (inView && !loading && loaderShow) {
      setLoading(true);
      const resp = JSON.parse((await apiClient.makeRequest(
        new RCommentsGetAll(
          props.postId,
          comments[comments.length - 1] ?
          comments[comments.length - 1].dateCreate :
          0
        )
      )).units);
      setComments([...comments, ...resp]);
      if (resp.length < commentCount) {
        setLoaderShow(false);
      }
      setLoading(false);
    }
  };
  const sendComment = async () => {
    if (comment.trim() === "") {
      setCommentError("Введите сообщение");
      return;
    }
    setCommentError(null);
    const resp = (await apiClient.makeRequest(
      new RCommentsCreate(props.postId, comment)
    )).comment;
    setComment("");
    setPostedComments([...postedComments, resp]);
  };

  return (
    <div>
      <Box display="flex" padding="16px">
        <TextField
          label="Сообщение" multiline
          style={{flexGrow: 1, marginRight: 5}}
          value={comment} onChange={(ev) => setComment(ev.target.value)}
          error={commentError} helperText={commentError}
        />
        <div style={{flexBasis: 56, alignSelf: "flex-start"}}>
          <IconButton style={{marginBottom: 5}} onClick={sendComment}><Send /></IconButton>
          <IconButton onClick={() => apiClient.onError("Будет в следующем обновлении")}>
            <AttachFile />
          </IconButton>
        </div>
      </Box>
      <List>
        {comments.map(comment => <Comment comment={comment} key={comment.id} />)}
        {postedComments.map(comment => <Comment comment={comment} key={comment.id} />)}
      </List>
      {loaderShow && <InView onChange={onCommentsShown} as="div" style={{
        width: "100%",
        textAlign: "center",
        padding: 10
      }}>
        <CircularProgress />
      </InView>}
    </div>
  );
}

export default Comments;
