import { useParams } from "react-router";
import { CircularProgress, Container } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import {ApiContext, proxyAddr} from "../api/ApiContext";
import RPostGet from "../api/requests/post/RPostGet";
import Comments from "../components/Comments";
import Tags from "../components/Tags";

function Post(props) {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [tags, setTags] = useState(null);
  const apiClient = useContext(ApiContext);

  useEffect(() => {
    async function loadPost() {
      if (apiClient.loginInfo) {
        const response = await apiClient.makeRequest(
          new RPostGet(postId)
        );
        setPost(response.unit);
        setTags(JSON.parse(response.tags));
      } else {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", proxyAddr + "post/" + postId);
        xhr.responseType = "json";
        xhr.onload = () => {
          setPost(xhr.response["J_RESPONSE"].unit);
          setTags(JSON.parse(xhr.response["J_RESPONSE"].tags));
        };
        xhr.send();
      }
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
          {apiClient.loginInfo ? <Comments postId={postId} /> : ""}
        </> :
        <div style={{textAlign: "center", padding: 20}}>
          <CircularProgress />
        </div>
      }
    </Container>
  );
}

export default Post;
