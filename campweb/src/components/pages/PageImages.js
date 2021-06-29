import { Typography, GridList, GridListTile } from "@material-ui/core";
import CampfireImage from "../CampfireImage";

function PageImages(props) {
  return (
    <div>
      {
        props.page.title ?
        <Typography variant="body1">{props.page.title}</Typography> :
        ""
      }
      <GridList component="div" cellHeight={160} cols={3}>
        {JSON.parse(props.page.imagesIds).map((id) => (
          <GridListTile key={id}>
            <CampfireImage id={id} backdrop style={{
              left: "50%",
              height: "100%",
              position: "relative",
              transform: "translateX(-50%)"
            }} />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}

export default PageImages;
