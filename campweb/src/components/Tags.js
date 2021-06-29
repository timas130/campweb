import { Chip, Avatar } from "@material-ui/core";
import CampfireImage from "./CampfireImage";

function Tag(props) {
  return (
    <Chip
      style={{margin: props.main ? "2px 0 2px 10px" : "2px 0 2px 2px"}}
      variant={props.main ? "default" : "outlined"}

      label={props.jsonDB["J_NAME"]}
      avatar={props.jsonDB["J_IMAGE_ID"] ? <Avatar>
        <CampfireImage id={props.jsonDB["J_IMAGE_ID"]} style={{maxWidth: "100%"}} />
      </Avatar> : null}
    />
  );
}

function Tags(props) {
  return (
    <div>
      {
        props.tags
          .filter(tag => tag.parentUnitId === 0)
          .map(
            tag => <>
              <Tag main jsonDB={JSON.parse(tag.jsonDB)} />
              {
                props.tags
                  .filter(childTag => childTag.parentUnitId === tag.id)
                  .map(childTag => <Tag jsonDB={JSON.parse(childTag.jsonDB)} />)
              }
            </>
          )
      }
    </div>
  );
}

export default Tags;
