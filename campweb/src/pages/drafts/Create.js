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
import {Add, Code, Done, FormatQuote, Image, Link, TextFormat, Videocam} from "@material-ui/icons";
import {useContext, useEffect, useState} from "react";
import {PageTextCreate} from "../../components/pages/PageText";
import Pages from "../../components/pages/Pages";
import {theme} from "../../App";
import {PageVideoCreate} from "../../components/pages/PageVideo";
import API from "../../api/api.json";
import {ApiContext, proxyAddr} from "../../api/ApiContext";
import {PageSpoilerCreate} from "../../components/pages/PageSpoiler";
import {useParams} from "react-router";
import RPostGetDraft from "../../api/requests/post/RPostGetDraft";
import RPostPutPage from "../../api/requests/post/RPostPutPage";
import RPostChangePage from "../../api/requests/post/RPostChangePage";
import RPostRemovePage from "../../api/requests/post/RPostRemovePage";
import {PageQuoteCreate} from "../../components/pages/PageQuote";
import {PageImageCreate} from "../../components/pages/PageImage";
import {useHistory, useLocation} from "react-router-dom";
import {PageLinkCreate} from "../../components/pages/PageLink";
import { resizeImage } from "../../api/utils/image";

function Create() {
  const apiClient = useContext(ApiContext);
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  useEffect(() => {
    if (! (location.state || {}).fandom && ! params.draftId) {
      history.push("/drafts");
    }
  // eslint-disable-next-line
  }, []);
  const [draftId, setDraftId] = useState(parseInt(params.draftId) || 0);
  const [fandomId, setFandomId] = useState((location.state || {}).fandom);
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
      let req;
      if (editing === -1) {
        req = new RPostPutPage(
          draftId, fandomId, [page]
        );
      } else {
        req = new RPostChangePage(
          draftId, page, editing
        );
      }
      if (page["J_PAGE_TYPE"] === API["PAGE_TYPE_VIDEO"]) {
        req.addDataOutput(await (await fetch(proxyAddr + "yt/" + page.videoId)).blob());
      } else if (page["J_PAGE_TYPE"] === API["PAGE_TYPE_IMAGE"]) {
        console.log("[syncPageWithServer] resizing image with size:", page.imageBlob.size);
        const resized = await resizeImage(page.imageBlob, 1500, 1024 * 128);
        if (! resized) throw new Error("Картинка слишком большая (даже с шакалами)");
        console.log("[syncPageWithServer] resized, resulting size:", resized.size);
        req.addDataOutput(resized);
        req.dataOutput = [...JSON.parse(req.dataOutput), -1];
      } else if (page["J_PAGE_TYPE"] === API["PAGE_TYPE_IMAGES"]) {
        for (const blob of page.imageBlobs) {
          const resized = await resizeImage(blob, 1500, 1024 * 128);
          if (! resized) throw new Error("image is too large");
          req.addDataOutput(resized);
        }
        for (const blob of page.imageBlobs) {
          const resized = await resizeImage(blob, 500, 1024 * 16);
          if (! resized) throw new Error("image is too large");
          req.addDataOutput(resized);
        }
        req.dataOutput = [...JSON.parse(req.dataOutput), -1];
      }
      let resp;
      try {
        resp = await apiClient.makeRequest(req);
      } catch (e) {
        if (e.includes("E_BAD_PAGE") && page["J_PAGE_TYPE"] === API["PAGE_TYPE_IMAGE"]) {
          apiClient.onError(
            "Скорее всего ошибка в том, что изображение " +
            "слишком большое, а сжимать их на клиенте я пока не смог."
          );
          throw new Error("image too big");
        }
      }
      if (editing === -1) {
        setDraftId(resp.unitId);
        setPages([...pages, ...JSON.parse(resp.pages)]);
      } else {
        const newPages = [...pages];
        newPages[editing] = resp.page;
        setPages(newPages);
      }
    } catch (e) {
      apiClient.onError(e.toString());
    }
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
        diagType === API["PAGE_TYPE_IMAGES"] ? <PageImageCreate {...createElProps} /> :
        diagType === API["PAGE_TYPE_LINK"] ? <PageLinkCreate {...createElProps} /> :
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
          <ListItem button onClick={() => createPage(API["PAGE_TYPE_LINK"])}>
            <ListItemIcon><Link /></ListItemIcon>
            <ListItemText>Ссылка</ListItemText>
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
      <Fab
        style={{
          position: "fixed",
          bottom: 16, right: 16,
          background: theme.palette.success.main
        }}
        onClick={() => history.push(`/drafts/${draftId}/publish`)}
        disabled={!draftId}
      ><Done /></Fab>
    </Container>
  );
}

export default Create;
