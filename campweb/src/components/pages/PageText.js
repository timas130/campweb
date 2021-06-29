import { Typography } from "@material-ui/core";
import FormattedText from "../FormattedText";

function PageText(props) {
  // TODO: icon
  return (<Typography variant="body1" style={{
    textAlign:
      props.page.align === 0 ? "left" :
      props.page.align === 1 ? "right" :
      props.page.align === 2 ? "center" :
      "left",
    fontSize:
      props.page["J_SIZE"] === 0 ? "medium" :
      props.page["J_SIZE"] === 1 ? "large" :
      "medium"
  }}>
    <FormattedText text={props.page["J_TEXT"]} />
  </Typography>);
}

export default PageText;
