import CampfireImage from "../CampfireImage";
import {useState} from "react";
import API from "../../api/api.json";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, GridList, GridListTile,
  IconButton,
  useMediaQuery
} from "@material-ui/core";
import {theme} from "../../App";
import {Close, Done} from "@material-ui/icons";

function PageImage(props) {
  // TODO: figure out gifId
  return (
    <CampfireImage id={props.page["J_IMAGE_ID"]} style={{
      width: "100%",
      // TODO: reset minimum height after load
      minHeight: 100
    }} backdrop />
  );
}
export default PageImage;

export function PageImageCreate(props) {
  const { onClose, open } = props;
  const [page] = useState({
    ...props.page,
    J_PAGE_TYPE: props.page["J_PAGE_TYPE"] || API["PAGE_TYPE_IMAGE"]
  });
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <Dialog open={open} maxWidth="sm" fullWidth fullScreen={fullScreen}>
      <DialogTitle>Картинка</DialogTitle>
      <DialogContent>
        <GridList cols={3}>
          <GridListTile>
            <CampfireImage id={1} style={{
              left: "50%",
              height: "100%",
              position: "relative",
              transform: "translateX(-50%)"
            }} />
          </GridListTile>
        </GridList>
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
