import { Chip, Avatar } from "@material-ui/core";
import CampfireImage from "./CampfireImage";

export function Tag(props) {
  const { main, jsonDB, index, style, ...rest } = props;
  return (
    <Chip
      style={{
        margin: main ?
          (index === 0 ? "2px 0 2px 0" : "2px 0 2px 10px") :
          "2px 0 2px 2px",
        ...style
      }}
      color={main ? "primary" : "default"}
      label={jsonDB["J_NAME"]}
      avatar={jsonDB["J_IMAGE_ID"] ? <Avatar>
        <CampfireImage id={jsonDB["J_IMAGE_ID"]} style={{maxWidth: "100%"}} />
      </Avatar> : null}
      {...rest}
    />
  );
}

function Tags(props) {
  return (
    <div>
      {props.tags
        .filter(tag => tag.parentUnitId === 0)
        .map((tag, idx) => <>
          <Tag main index={idx} key={tag.id} jsonDB={JSON.parse(tag.jsonDB)} />
          {props.tags
            .filter(childTag => childTag.parentUnitId === tag.id)
            .map(childTag => <Tag key={childTag.id} jsonDB={JSON.parse(childTag.jsonDB)} />)}
        </>)}
    </div>
  );
}

export default Tags;
