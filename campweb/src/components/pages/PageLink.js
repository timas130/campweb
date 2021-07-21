import {
  Box,
  Dialog, DialogActions,
  DialogContent,
  DialogTitle, IconButton,
  Link,
  Paper,
  TextField,
  Typography,
  useMediaQuery
} from "@material-ui/core";
import {Close, Done, Link as LinkIcon} from "@material-ui/icons";
import {useState} from "react";
import API from "../../api/api.json";
import {theme} from "../../App";

function PageLink(props) {
  return (
    <Paper
      variant="outlined" style={{padding: 10}}
      onClick={() => window.open(props.page.link, "_blank")}
    >
      <Box display="flex" position="relative">
        <Box alignSelf="center" style={{paddingRight: 10}}><LinkIcon /></Box>
        <Box flexGrow={1} style={{minWidth: 0}}>
          {
            props.page.name &&
            <Typography variant="body2" color="textSecondary">{props.page.name}:</Typography>
          }
          <Link style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block"
          }} href={props.page.link} target="_blank">{props.page.link}</Link>
        </Box>
      </Box>
    </Paper>
  );
}

export default PageLink;

export function PageLinkCreate(props) {
  const { onClose, open } = props;
  const [page, setPage] = useState({
    ...props.page,
    J_PAGE_TYPE: API["PAGE_TYPE_LINK"],
    link: props.page.link || "",
    name: props.page.name || ""
  });
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Dialog open={open} maxWidth="sm" fullWidth fullScreen={fullScreen}>
      <DialogTitle>Ссылка</DialogTitle>
      <DialogContent>
        <TextField
          label="Название" value={page.name} fullWidth
          onChange={ev => setPage({...page, name: ev.target.value})}
          style={{marginBottom: 16}}
        />
        <TextField
          label="Ссылка" value={page.link} fullWidth
          onChange={ev => setPage({...page, link: ev.target.value})}
        />
      </DialogContent>
      <DialogActions>
        <IconButton size="small" color="primary"
                    onClick={() => onClose(page)}
                    disabled={(page.name || "").trim() === "" ||
                              (page.link || "").trim() === "" }>
          <Done fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onClose({})}>
          <Close fontSize="small" />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}

