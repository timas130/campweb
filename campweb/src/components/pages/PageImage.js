import CampfireImage from "../CampfireImage";
import {useRef, useState} from "react";
import API from "../../api/api.json";
import {
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle, FormControlLabel, GridList, GridListTile,
  IconButton,
  useMediaQuery
} from "@material-ui/core";
import {theme} from "../../App";
import {Add, Close, Delete, Done} from "@material-ui/icons";

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
  const [images, setImages] = useState(
    props.page["J_PAGE_TYPE"] === API["PAGE_TYPE_IMAGE"] ? [props.page["J_IMAGE_ID"]] :
    props.page["J_PAGE_TYPE"] === API["PAGE_TYPE_IMAGES"] ? JSON.parse(props.page.imagesIds) :
    []
  );
  const [asOneBlock, setAsOneBlock] = useState(true);
  const fileInputRef = useRef();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  const addImage = ev => {
    if (! ev.target.files[0]) return;
    const file = ev.target.files[0];
    setImages([...images, file]);
  };
  const onDone = () => {
    if (images.length === 1) {
      console.log("sending as PAGE_TYPE_IMAGE");
      onClose({
        J_PAGE_TYPE: API["PAGE_TYPE_IMAGE"],
        J_H: 0, J_W: 0, J_IMAGE_ID: 0, gifId: 0,
        imageBlob: images[0]
      });
    } else if (asOneBlock) {
      console.log("sending as PAGE_TYPE_IMAGES");
      onClose({
        J_PAGE_TYPE: API["PAGE_TYPE_IMAGES"],
        imagesCount: images.length, imageBlobs: images,
        imagesIds: [], imagesMiniIds: [],
        imagesMiniSizesW: [], imagesMiniSizesH: [],
        removePageIndex: -1, replacePageIndex: -1
      });
    }
  };

  return (
    <Dialog open={open} maxWidth="sm" fullWidth fullScreen={fullScreen}>
      <DialogTitle>Картинка</DialogTitle>
      <DialogContent>
        <input type="file" ref={fileInputRef} style={{display: "none"}}
               onChange={addImage} />
        <GridList cols={3}>
          {images.map((image, idx) => (
            <GridListTile key={idx}>
              <img src={URL.createObjectURL(image)} alt={image.name} style={{
                left: "50%",
                top: "50%",
                position: "relative",
                transform: "translate(-50%, -50%)"
              }} />
              <IconButton
                size="small"
                onClick={() => {
                  const newImages = [...images];
                  newImages.splice(idx, 1);
                  setImages(newImages);
                }}
                style={{
                  right: 4, top: 4,
                  position: "absolute",
                  background: "rgba(0,0,0,.5)"
                }}
              >
                <Delete />
              </IconButton>
            </GridListTile>
          ))}
          <GridListTile>
            <IconButton
              style={{
                left: "50%",
                top: "50%",
                position: "relative",
                transform: "translate(-50%, -50%)"
              }}
              onClick={() => {
                fileInputRef.current.files = null;
                fileInputRef.current.click();
              }}
            ><Add /></IconButton>
          </GridListTile>
        </GridList>
        <FormControlLabel
          control={<Checkbox
            color="primary" checked={asOneBlock}
            onChange={ev => setAsOneBlock(ev.target.checked)}
          />}
          label="Добавить как один блок"
          disabled={images.length < 2}
        />
      </DialogContent>
      <DialogActions>
        <IconButton size="small" color="primary"
                    disabled={images.length === 0}
                    onClick={onDone}>
          <Done fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={() => onClose({})}>
          <Close fontSize="small" />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}
