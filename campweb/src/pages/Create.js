import {
  Button,
  Container,
  Dialog, DialogActions,
  DialogTitle,
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@material-ui/core";
import {Add, Code, Done, TextFormat, Videocam} from "@material-ui/icons";
import {useContext, useState} from "react";
import {PageTextCreate} from "../components/pages/PageText";
import Pages from "../components/pages/Pages";
import {theme, useLoggedIn} from "../App";
import {PageVideoCreate} from "../components/pages/PageVideo";
import API from "../api/api.json";
import {useHistory} from "react-router-dom";
import {ApiContext} from "../api/ApiContext";
import {PageSpoilerCreate} from "../components/pages/PageSpoiler";

function Create() {
  const history = useHistory();
  const apiClient = useContext(ApiContext);

  // const { draftId } = useParams();
  const [pages, setPages] = useState([]);
  const [page, setPage] = useState({});
  const [pageEditing, setPageEditing] = useState(-1);
  const [typeDiagOpen, setTypeDiagOpen] = useState(false);

  const [diagOpen, setDiagOpen] = useState(true);
  const [diagType, setDiagType] = useState(null);

  useLoggedIn(history, apiClient);
  const flushPage = page => {
    setDiagOpen(false);
    setDiagType(0);
    if (page["J_PAGE_TYPE"]) {
      if (pageEditing !== -1) {
        const newPages = [...pages];
        newPages[pageEditing] = page;
        setPages(newPages);
      } else {
        setPages([...pages, page]);
      }
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
        null
      }

      <Pages
        pages={pages}
        onEdit={editPage}
        onDelete={idx => {
          const newPages = [...pages];
          newPages.splice(idx, 1);
          setPages(newPages);
        }}
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
