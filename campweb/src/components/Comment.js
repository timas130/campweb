import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, ListItemSecondaryAction, Box, IconButton, Paper } from "@material-ui/core";
import CampfireImage from "./CampfireImage";
import React, { useContext, useState } from "react";
import moment from "moment";
import { ArrowDownward, ArrowUpward, Reply } from "@material-ui/icons";
import Karma from "./Karma";
import FormattedText from "./FormattedText";
import PageImages from "./pages/PageImages";
import { ApiContext } from "../api/ApiContext";
import RPublicationsKarmaAdd from "../api/requests/post/RPublicationsKarmaAdd";

function CommentQuote(props) {
  return (
    props.jsonDB.quoteId ?
    <>
      <Paper variant="outlined" style={{padding: 10, margin: 10}}>
        <Typography component="span" variant="body2" color="textSecondary">
          {props.jsonDB.quoteCreatorName}:&nbsp;
        </Typography>
        <FormattedText text={props.quoteText} />
        {
          props.jsonDB.quoteImages ?
          <>
            <br />
            <PageImages page={{imagesIds: props.jsonDB.quoteImages}} />
          </> :
          ""
        }
        {
          props.jsonDB.quoteStickerImageId ?
          <>
            <br /><CampfireImage id={props.jsonDB.quoteStickerImageId} />
          </> :
          ""
        }
      </Paper>
    </> :
    ""
  );
}

function Comment(props) {
  const jsonDB = JSON.parse(props.comment.jsonDB);
  const [voted, setVoted] = useState(0);
  const apiClient = useContext(ApiContext);

  let quoteText = jsonDB.quoteText;
  if (jsonDB.quoteText.length !== 0 &&
      jsonDB.quoteCreatorName.length !== 0 &&
      jsonDB.quoteText.startsWith(jsonDB.quoteCreatorName + ": ")) {
    quoteText = quoteText.slice((jsonDB.quoteCreatorName + ": ").length, quoteText.length);
  }

  const addKarma = async (up) => {
    // TODO: anonymous voting
    const resp = await apiClient.makeRequest(new RPublicationsKarmaAdd(
      props.comment.id, up
    ));
    setVoted(resp.myKarmaCount);
  };

  return (
    <ListItem alignItems="flex-start">
      <ListItemAvatar>
        <React.Fragment>
          <Avatar>
            <CampfireImage
              id={props.comment.creator["J_IMAGE_ID"]}
              style={{width: "100%"}}
            />
          </Avatar>
          <IconButton size="small" style={{
            marginTop: 5,
            marginLeft: 5,
            textAlign: "center"
          }}>
            <Reply />
          </IconButton>
        </React.Fragment>
      </ListItemAvatar>
      <ListItemText
        primary={props.comment.creator["J_NAME"]}
        secondaryTypographyProps={{component: "div"}}
        secondary={
          <React.Fragment>
            <Typography variant="body2">
              {moment(props.comment.dateCreate).locale("ru").calendar()}
              {jsonDB.changed ? " (изм.)" : ""}
            </Typography>
            <Typography component="div" variant="body1" color="textPrimary">
              <CommentQuote jsonDB={jsonDB} quoteText={quoteText} />
              <FormattedText text={jsonDB["J_TEXT"]} />
              {
                jsonDB.imageId ?
                <>
                  <br /><CampfireImage id={jsonDB.imageId} style={{
                    maxWidth: "100%"
                  }} backdrop />
                </> :
                ""
              }
              { /* TODO: sticker link */
                jsonDB.stickerImageId ?
                <>
                  <br /><CampfireImage id={jsonDB.stickerImageId} />
                </> :
                ""
              }
            </Typography>
          </React.Fragment>
        } />
      <ListItemSecondaryAction>
        <Box display="flex" flexDirection="column">
          <IconButton
            size="small" onClick={() => addKarma(true)}
            disabled={!! (props.comment.myKarma || voted)}
          >
            <ArrowUpward />
          </IconButton>
          <Karma amount={props.comment.karmaCount + voted} />
          <IconButton
            size="small" onClick={() => addKarma(false)}
            disabled={!! (props.comment.myKarma || voted)}
          >
            <ArrowDownward />
          </IconButton>
        </Box>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

export default Comment;
