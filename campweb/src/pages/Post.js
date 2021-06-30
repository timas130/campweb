import { useHistory, useParams } from "react-router";
import { CircularProgress, Container } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import { ApiContext } from "../api/ApiContext";
import RPostGet from "../api/requests/post/RPostGet";
import Comments from "../components/Comments";
import Tags from "../components/Tags";
import { useLoggedIn } from "../App";

function Post(props) {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [tags, setTags] = useState(null);
  const apiClient = useContext(ApiContext);
  const history = useHistory();

  useLoggedIn(history, apiClient);
  useEffect(() => {
    async function loadPost() {
      const response = await apiClient.makeRequest(
        new RPostGet(postId)
      );
      setPost(response.unit);
      setTags(JSON.parse(response.tags));
    }
    if (! post) loadPost();
  }, [apiClient, post, postId]);

  return (
    <Container maxWidth="sm">
      {
        post ?
        <>
          <PostCard post={post} fullPage />
          {tags && <Tags tags={tags} />}
          <Comments postId={postId} />
        </> :
        <div style={{textAlign: "center", padding: 20}}>
          <CircularProgress />
        </div>
      }
    </Container>
  );
}

export default Post;
