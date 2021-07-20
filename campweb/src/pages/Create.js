import {
  Backdrop,
  Button, CircularProgress,
  Container,
  Dialog, DialogActions,
  DialogTitle,
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import {Add, Code, Done, FormatQuote, Image, TextFormat, Videocam} from "@material-ui/icons";
import {useContext, useEffect, useState} from "react";
import {PageTextCreate} from "../components/pages/PageText";
import Pages from "../components/pages/Pages";
import {theme} from "../App";
import {PageVideoCreate} from "../components/pages/PageVideo";
import API from "../api/api.json";
import {ApiContext, proxyAddr} from "../api/ApiContext";
import {PageSpoilerCreate} from "../components/pages/PageSpoiler";
import {useParams} from "react-router";
import RPostGetDraft from "../api/requests/post/RPostGetDraft";
import RPostPutPage from "../api/requests/post/RPostPutPage";
import RPostChangePage from "../api/requests/post/RPostChangePage";
import RPostRemovePage from "../api/requests/post/RPostRemovePage";
import {PageQuoteCreate} from "../components/pages/PageQuote";
import {PageImageCreate} from "../components/pages/PageImage";

function Create() {
  const apiClient = useContext(ApiContext);

  const params = useParams();
  const [draftId, setDraftId] = useState(parseInt(params.draftId) || 0);
  const [fandomId, setFandomId] = useState(params.fandom || 2597);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState({});
  const [pageEditing, setPageEditing] = useState(-1);
  const [typeDiagOpen, setTypeDiagOpen] = useState(false);

  const [diagOpen, setDiagOpen] = useState(true);
  const [diagType, setDiagType] = useState(null);

  async function syncPageWithServer(page, editing) {
    setLoading(true);
    try {
      if (editing === -1) { // put page
        const req = new RPostPutPage(
          draftId, fandomId, [page]
        );
        if (page["J_PAGE_TYPE"] === API["PAGE_TYPE_VIDEO"]) {
          req.addDataOutput(await (await fetch(proxyAddr + "yt/" + page.videoId)).blob());
        }
        const resp = await apiClient.makeRequest(req);
        setDraftId(resp.unitId);
        setPages([...pages, ...JSON.parse(resp.pages)]);
      } else {
        const resp = await apiClient.makeRequest(new RPostChangePage(
          draftId, page, editing
        ));
        const newPages = [...pages];
        newPages[editing] = resp.page;
        setPages(newPages);
      }
    } catch (e) {}
    setLoading(false);
  }
  const flushPage = page => {
    setDiagOpen(false);
    setDiagType(0);
    if (page["J_PAGE_TYPE"]) {
      console.log(page);
      syncPageWithServer(page, pageEditing);
    }
    setPageEditing(-1);
  };
  const createPage = type => {
    console.log("create page");
    setDiagType(type);
    setPage({});
    setPageEditing(-1); // just in case
    setTypeDiagOpen(false);
    setDiagOpen(true);
  };
  const editPage = idx => {
    console.log("edit page", idx);
    setDiagType(pages[idx]["J_PAGE_TYPE"]);
    setPage(pages[idx]);
    setPageEditing(idx);
    setTypeDiagOpen(false);
    setDiagOpen(true);
  };
  const deletePage = idx => {
    setLoading(true);
    const newPages = [...pages];
    newPages.splice(idx, 1);
    setPages(newPages);
    apiClient
      .makeRequest(new RPostRemovePage(draftId, [idx]))
      .then(() => setLoading(false));
  };

  useEffect(() => {
    async function loadDraft() {
      const resp = await apiClient.makeRequest(
        new RPostGetDraft(draftId)
      );
      console.log(resp.unit);
      setPages(JSON.parse(JSON.parse(resp.unit.jsonDB)["J_PAGES"]));
      setFandomId(resp.unit.fandom.id);
    }
    if (draftId !== 0) loadDraft();
  // eslint-disable-next-line
  }, []);

  const createElProps = {
    page, open: diagOpen,
    onClose: flushPage
  };
  return (
    <Container maxWidth="sm">
      {
        diagType === API["PAGE_TYPE_TEXT"] ? <PageTextCreate {...createElProps} /> :
        diagType === API["PAGE_TYPE_VIDEO"] ? <PageVideoCreate {...createElProps} /> :
        diagType === API["PAGE_TYPE_SPOILER"] ? <PageSpoilerCreate {...createElProps} /> :
        diagType === API["PAGE_TYPE_QUOTE"] ? <PageQuoteCreate {...createElProps} /> :
        diagType === API["PAGE_TYPE_IMAGE"] ? <PageImageCreate {...createElProps} /> :
        null
      }
      <Backdrop style={{zIndex: 99999}} open={loading}><CircularProgress /></Backdrop>

      <Pages
        pages={pages}
        onEdit={editPage}
        onDelete={deletePage}
      />

      <Dialog open={typeDiagOpen} onClose={() => setTypeDiagOpen(false)}>
        <DialogTitle>Выберите тип страницы</DialogTitle>
        <List>
          <ListItem button onClick={() => createPage(API["PAGE_TYPE_TEXT"])}>
            <ListItemIcon><TextFormat /></ListItemIcon>
            <ListItemText>Текст</ListItemText>
          </ListItem>
          <ListItem button onClick={() => createPage(API["PAGE_TYPE_VIDEO"])}>
            <ListItemIcon><Videocam /></ListItemIcon>
            <ListItemText>Видео</ListItemText>
          </ListItem>
          <ListItem button onClick={() => createPage(API["PAGE_TYPE_SPOILER"])}>
            <ListItemIcon><Code /></ListItemIcon>
            <ListItemText>Спойлер</ListItemText>
          </ListItem>
          <ListItem button onClick={() => createPage(API["PAGE_TYPE_QUOTE"])}>
            <ListItemIcon><FormatQuote /></ListItemIcon>
            <ListItemText>Цитата</ListItemText>
          </ListItem>
          <ListItem button onClick={() => createPage(API["PAGE_TYPE_IMAGE"])}>
            <ListItemIcon><Image /></ListItemIcon>
            <ListItemText>Картинка</ListItemText>
          </ListItem>
        </List>
        <DialogActions>
          <Button onClick={() => setTypeDiagOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>

      <Fab color="primary" style={{
        position: "fixed",
        bottom: 16, right: 80
      }} onClick={() => setTypeDiagOpen(true)}><Add /></Fab>
      <Fab style={{
        position: "fixed",
        bottom: 16, right: 16,
        background: theme.palette.success.main
      }}><Done /></Fab>
    </Container>
  );
}

export default Create;
