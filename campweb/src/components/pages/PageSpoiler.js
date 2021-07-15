import {
  Collapse,
  Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText, TextField,
  useMediaQuery
} from "@material-ui/core";
import {Close, Done, ExpandMore} from "@material-ui/icons";
import {useState} from "react";
import {theme} from "../../App";
import API from "../../api/api.json";

function PageSpoiler(props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <List><ListItem button onClick={() => setExpanded(! expanded)}>
        <ListItemIcon><ExpandMore /></ListItemIcon>
        <ListItemText primary={props.name} />
      </ListItem></List>
      <Collapse in={expanded}>
        {props.children}
      </Collapse>
    </>
  );
}
export default PageSpoiler;

export function PageSpoilerCreate(props) {
  const { onClose, open } = props;
  const [page, setPage] = useState({
    ...props.page,
    J_PAGE_TYPE: API["PAGE_TYPE_SPOILER"],
    name: props.page.name || "",
    count: props.page.count || 1
  });
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Dialog open={open} maxWidth="sm" fullWidth fullScreen={fullScreen}>
      <DialogTitle>Спойлер</DialogTitle>
      <DialogContent>
        <TextField
          type="number" label="Количество страниц"
          fullWidth value={page.count}
          onChange={ev => setPage({...page, count: ev.target.value})}
          style={{marginBottom: 16}}
        />
        <TextField
          label="Название"
          fullWidth value={page.name}
          onChange={ev => setPage({...page, name: ev.target.value})}
        />
      </DialogContent>
      <DialogActions>
        <IconButton size="small" style={{marginLeft: "auto"}}
                    color="primary" onClick={() => onClose(page)}
                    disabled={
                      page.count === "" ||
                      parseInt(page.count) < 1 ||
                      (page.name || "").trim() === ""
                    }>
          <Done fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onClose({})}>
          <Close fontSize="small" />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}
