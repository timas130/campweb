import {useState} from "react";
import API from "../../api/api.json";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  useMediaQuery
} from "@material-ui/core";
import {theme} from "../../index";
import {Close, Done} from "@material-ui/icons";

function PageVideo(props) {
  return (
    // I don't know how that even works
    <div style={{position: "relative", paddingTop: "56.25%"}}>
      <iframe
        src={"https://www.youtube-nocookie.com/embed/" + props.page.videoId} frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen style={{
          position: "absolute",
          top: 0, left: 0,
          width: "100%",
          height: "100%"
        }} title={props.page.videoId + "@youtube"}
      />
    </div>
  );
}
export default PageVideo;

export function PageVideoCreate(props) {
  const { onClose, open } = props;
  const [page, setPage] = useState({
    ...props.page,
    J_PAGE_TYPE: API["PAGE_TYPE_VIDEO"],
    videoId: props.page.videoId || "",
    J_H: 0, J_W: 0, imageId: 0
  });
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Dialog open={open} maxWidth="sm" fullWidth fullScreen={fullScreen}>
      <DialogTitle>Видео</DialogTitle>
      <DialogContent>
        <TextField
          label="ID видео на YouTube"
          helperText="https://youtube.com/watch?v=[тут будет id]"
          fullWidth value={page.videoId}
          onChange={(ev) => setPage({...page, videoId: ev.target.value})}
        />
      </DialogContent>
      <DialogActions>
        <IconButton size="small"
                    color="primary" onClick={() => onClose(page)}
                    disabled={! page.videoId}>
          <Done fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onClose({})}>
          <Close fontSize="small" />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}
