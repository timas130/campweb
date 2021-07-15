import CampfireImage from "../CampfireImage";

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
