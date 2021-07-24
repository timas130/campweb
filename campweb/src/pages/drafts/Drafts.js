import {useContext, useEffect, useState} from "react";
import {ApiContext} from "../../api/ApiContext";
import {
  Avatar,
  CircularProgress,
  Container,
  Dialog,
  Fab, IconButton,
  List,
  ListItem,
  ListItemAvatar, ListItemText, Toolbar, Typography
} from "@material-ui/core";
import RPublicationsDraftsGetAll, {amount} from "../../api/requests/post/RPublicationsDraftsGetAll";
import PostCard from "../../components/PostCard";
import {InView} from "react-intersection-observer";
import {theme} from "../../App";
import {Add, Close} from "@material-ui/icons";
import RFandomsGetAll, {subscribeYes, count} from "../../api/requests/fandoms/RFandomsGetAll";
import CampfireImage from "../../components/CampfireImage";
import {useHistory} from "react-router-dom";

function FandomSelector(props) {
  const { onSelect, open } = props;
  const apiClient = useContext(ApiContext);
  const [fandoms, setFandoms] = useState([]);
  const [canLoadMore, setCanLoadMore] = useState(true);

  async function loadMoreFandoms() {
    const req = new RFandomsGetAll(subscribeYes, fandoms.length);
    const resp = (await apiClient.makeRequest(req)).fandoms;
    setFandoms([...fandoms, ...JSON.parse(resp)]);
    if (resp.length < count) setCanLoadMore(false);
  }

  return (
    <Dialog open={open} fullScreen>
      <Toolbar>
        <Typography variant="h6">Выберите фэндом</Typography>
        <IconButton onClick={() => onSelect(null)} style={{marginLeft: "auto"}}>
          <Close />
        </IconButton>
      </Toolbar>
      <Container maxWidth="sm">
        <List>
          {fandoms.map(fandom => (
            <ListItem button onClick={() => onSelect(fandom.id)} key={fandom.id}>
              <ListItemAvatar>
                <Avatar><CampfireImage id={fandom.imageId} style={{width: "100%"}} /></Avatar>
              </ListItemAvatar>
              <ListItemText>{fandom.name}</ListItemText>
            </ListItem>
          ))}
          {canLoadMore &&
          <InView
            as="div" style={{textAlign: "center", padding: 10}}
            onChange={(inView) => inView && loadMoreFandoms()}
          >
            <CircularProgress />
          </InView>}
        </List>
      </Container>
    </Dialog>
  );
}

export default function Drafts() {
  const apiClient = useContext(ApiContext);
  const history = useHistory();

  const [drafts, setDrafts] = useState([]);
  const [hasMoreDrafts, setHasMoreDrafts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fandomSelOpen, setFandomSelOpen] = useState(false);

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
      <FandomSelector
        open={fandomSelOpen}
        onSelect={fandom => {
          if (fandom) {
            history.push({
              pathname: "/drafts/0",
              state: {fandom}
            });
          } else setFandomSelOpen(false);
        }}
      />
      {drafts.map(draft => (
        <PostCard post={draft} key={draft.id} draft />
      ))}

      {hasMoreDrafts && <InView as="div" style={{textAlign: "center", padding: 10}}
              onChange={(inView) => inView && loadMoreDrafts()}>
        <CircularProgress />
      </InView>}

      <Fab style={{
        position: "fixed",
        bottom: 16, right: 16,
        background: theme.palette.success.main
      }} onClick={() => setFandomSelOpen(true)}><Add /></Fab>
    </Container>
  );
}
