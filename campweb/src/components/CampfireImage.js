import { useContext, useState } from "react";
import { ApiContext } from "../api/ApiContext";
import RResourcesGet from "../api/requests/media/RResourcesGet";
import { CircularProgress, Backdrop } from "@material-ui/core";
import { InView } from "react-intersection-observer";
import {Skeleton} from "@material-ui/lab";

function CampfireImage(props) {
  const [image, setImage] = useState(null);
  const [backdrop, setBackdrop] = useState(false);
  const apiClient = useContext(ApiContext);

  async function loadImage() {
    let response;
    if (window.caches) {
      const cache = (await window.caches.open("resources"));
      const addr = "/_resources_cache/" + props.id.toString();
      let match = await cache.match(addr);
      if (! match) {
        console.log("[CampfireImage] no cache record, fetching " + props.id);
        response = await apiClient.makeRequest(new RResourcesGet(props.id));
        await cache.put(addr, new Response(response, {status: 200, statusText: "OK"}));
      } else {
        response = await match.blob();
        console.log("[CampfireImage] found cache record for resource " + props.id);
      }
    } else {
      console.log("[CampfireImage] cache not supported, fetching " + props.id);
      response = await apiClient.makeRequest(new RResourcesGet(props.id));
    }
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
      ...props.style
    }} onChange={(inView) => inView && loadImage()}>
      <Skeleton variant="rect" width="100%" height="100%" animation={false} />
    </InView>
  );
}

export default CampfireImage;
