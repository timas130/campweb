import {useContext, useEffect, useState} from "react";
import {ApiContext} from "../api/ApiContext";
import {CircularProgress, Container, Fab} from "@material-ui/core";
import RPublicationsDraftsGetAll, {amount} from "../api/requests/post/RPublicationsDraftsGetAll";
import PostCard from "../components/PostCard";
import {InView} from "react-intersection-observer";
import {theme} from "../App";
import {Add} from "@material-ui/icons";

export default function Drafts() {
  const apiClient = useContext(ApiContext);
  const [drafts, setDrafts] = useState([]);
  const [hasMoreDrafts, setHasMoreDrafts] = useState(true);
  const [loading, setLoading] = useState(false);

  async function loadMoreDrafts() {
    if (loading) return;
    setLoading(true);
    const units = JSON.parse((await apiClient.makeRequest(
      new RPublicationsDraftsGetAll(drafts.length, 0)
    )).units);
    setDrafts([...drafts, ...units]);
    if (units.length < amount) setHasMoreDrafts(false);
    setLoading(false);
  }
  useEffect(() => {
    loadMoreDrafts();
  // eslint-disable-next-line
  }, []);

  return (
    <Container maxWidth="sm">
      {drafts.map(draft => (
        <PostCard post={draft} key={draft.id} draft />
      ))}

      {hasMoreDrafts && <InView as="div" style={{textAlign: "center", padding: 10}}
              onChange={(inView) => inView && loadMoreDrafts}>
        <CircularProgress />
      </InView>}

      <Fab style={{
        position: "fixed",
        bottom: 16, right: 16,
        background: theme.palette.success.main
      }}><Add /></Fab>
    </Container>
  );
}
