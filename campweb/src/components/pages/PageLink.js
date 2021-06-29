import { Box, Link, Paper, Typography } from "@material-ui/core";
import { Link as LinkIcon } from "@material-ui/icons";

function PageLink(props) {
  return (
    <Paper
      variant="outlined" style={{padding: 10}}
      onClick={() => window.open(props.page.link, "_blank")}
    >
      <Box display="flex" position="relative">
        <Box alignSelf="center" style={{paddingRight: 10}}><LinkIcon /></Box>
        <Box flexGrow={1} style={{minWidth: 0}}>
          {
            props.page.name &&
            <Typography variant="body2" color="textSecondary">{props.page.name}:</Typography>
          }
          <Link style={{
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "block"
          }} href={props.page.link}>{props.page.link}</Link>
        </Box>
      </Box>
    </Paper>
  );
}

export default PageLink;
