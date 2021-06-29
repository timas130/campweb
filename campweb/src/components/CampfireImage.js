import { useContext, useState } from "react";
import { ApiContext } from "../api/ApiContext";
import RResourcesGet from "../api/requests/media/RResourcesGet";
import { CircularProgress, Backdrop } from "@material-ui/core";
import { InView } from "react-intersection-observer";

function CampfireImage(props) {
  const [image, setImage] = useState(null);
  const [backdrop, setBackdrop] = useState(false);
  const apiClient = useContext(ApiContext);

  async function loadImage() {
    const response = await apiClient.makeRequest(new RResourcesGet(props.id));
    setImage(URL.createObjectURL(response));
  }

  return image ? (<>
    <img src={image} alt={props.id.toString()}
      style={{cursor: props.backdrop ? "pointer" : null, ...props.style}}
      onClick={() => props.backdrop && setBackdrop(true)} />
    <Backdrop open={backdrop} onClick={() => setBackdrop(false)} style={{zIndex: 99999, padding: 10}}>
      <img src={image} alt={props.id.toString()} style={{
        maxWidth: "100%",
        maxHeight: "100%"
      }} />
    </Backdrop>
  </>) : (
    <InView as="div" style={{
      position: "relative",
      width: "100%",
      height: 100,
      minHeight: props.minHeight,
      ...props.style
    }} onChange={(inView) => inView && loadImage()}>
      <CircularProgress style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -20,
        marginLeft: -20
      }} />
    </InView>
  );
}

export default CampfireImage;
