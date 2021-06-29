import { List, CircularProgress } from "@material-ui/core";
import { useContext, useState } from "react";
import InView from "react-intersection-observer";
import { ApiContext } from "../api/ApiContext";
import Comment from "./Comment";
import RCommentsGetAll from "../api/requests/comments/RCommentsGetAll";

function Comments(props) {
  const apiClient = useContext(ApiContext);
  const [loaderShow, setLoaderShow] = useState(true);
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);

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
      if (resp.length === 0) {
        setLoaderShow(false);
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <List>
        {comments.map(comment => <Comment comment={comment} key={comment.id} />)}
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
