import { Paper, Typography } from "@material-ui/core";

function PageQuote(props) {
  return (
    <Paper variant="outlined" style={{padding: 10}}>
      {
        props.page.author &&
        <Typography variant="body2" color="textSecondary">{props.page.author}:</Typography>
      }
      {props.page.text}
    </Paper>
  );
}

export default PageQuote;
