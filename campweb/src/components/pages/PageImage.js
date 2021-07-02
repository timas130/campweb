import CampfireImage from "../CampfireImage";

function PageImage(props) {
  // TODO: figure out gifId
  return (
    <CampfireImage id={props.page["J_IMAGE_ID"]} style={{
      width: "100%",
      height: "auto"
    }} backdrop />
  );
}

export default PageImage;
