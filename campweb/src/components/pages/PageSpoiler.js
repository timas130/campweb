import { Collapse, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { useState } from "react";

function PageSpoiler(props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <List><ListItem button onClick={() => setExpanded(! expanded)}>
        <ListItemIcon><ExpandMore /></ListItemIcon>
        <ListItemText primary={props.name} />
      </ListItem></List>
      <Collapse in={expanded}>
        {props.children}
      </Collapse>
    </>
  );
}

export default PageSpoiler;
