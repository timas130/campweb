import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, IconButton,
  Paper,
  TextField,
  Typography,
  useMediaQuery
} from "@material-ui/core";
import {useState} from "react";
import API from "../../api/api.json";
import {theme} from "../../index";
import {Close, Done} from "@material-ui/icons";

function PageQuote(props) {
  return (
    <Paper variant="outlined" style={{padding: 10}}>
      {
        props.page.author &&
        <Typography variant="body2" color="textSecondary">{props.page.author}:</Typography>
      }
      {props.page.text}
    </Paper>
  );
}

export default PageQuote;

export function PageQuoteCreate(props) {
  const { onClose, open } = props;
  const [page, setPage] = useState({
    ...props.page,
    J_PAGE_TYPE: API["PAGE_TYPE_QUOTE"],
    author: props.page.author || "",
    text: props.page.text || ""
  });
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Dialog open={open} maxWidth="sm" fullWidth fullScreen={fullScreen}>
      <DialogTitle>Цитата</DialogTitle>
      <DialogContent>
        <TextField
          label="Текст цитаты" value={page.text} fullWidth
          onChange={ev => setPage({...page, text: ev.target.value})}
          style={{marginBottom: 16}}
        />
        <TextField
          label="Автор (не обязательно)" value={page.author} fullWidth
          onChange={ev => setPage({...page, author: ev.target.value})}
        />
      </DialogContent>
      <DialogActions>
        <IconButton size="small" color="primary"
                    onClick={() => onClose(page)}
                    disabled={(page.text || "").trim() === ""}>
          <Done fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onClose({})}>
          <Close fontSize="small" />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}
