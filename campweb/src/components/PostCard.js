import { Card, CardHeader, CardContent, CardActions, Avatar, Link, Collapse, Button, IconButton } from "@material-ui/core";
import CampfireImage from "./CampfireImage";
import Page from "./pages/Page";
import moment from "moment";
import "moment/locale/ru";
import { useContext, useState } from "react";
import "./PostCard.css";
import { ArrowDownward, ArrowUpward, Comment } from "@material-ui/icons";
import { theme } from "../App";
import { ApiContext } from "../api/ApiContext";
import RPublicationsKarmaAdd from "../api/requests/post/RPublicationsKarmaAdd";

function PostCard(props) {
  // campfire in a nutshell
  const pages = JSON.parse(JSON.parse(props.post.jsonDB)["J_PAGES"]);

  const [expanded, setExpanded] = useState(false);
  const [voted, setVoted] = useState(0);
  const apiClient = useContext(ApiContext);

  const addKarma = async (up) => {
    // TODO: anonymous voting
    const resp = await apiClient.makeRequest(new RPublicationsKarmaAdd(
      props.post.id, up
    ));
    setVoted(resp.myKarmaCount);
  };

  return (
    <Card style={{marginBottom: 10}}>
      <CardHeader
        avatar={
          <Avatar>
            <CampfireImage id={props.post.fandom.imageId}
              style={{width: "100%"}} />
          </Avatar>
        }
        title={props.post.fandom.name}
        subheader={
          <span>
            <Link href={`/account/${props.post.creator["J_ID"]}`}>{props.post.creator["J_NAME"]}</Link>
            &nbsp;{moment(props.post.dateCreate).locale("ru").calendar()}&nbsp;
            {
              props.post.rubricId ?
              <Link href={`/rubric/${props.post.rubricId}`}>{props.post.rubricName}</Link> :
              ""
            }
          </span>
        }
      />
      <CardContent>
        <Collapse collapsedHeight={250} in={expanded}>
          {pages.map((page, idx) => (
            <Page page={page} key={idx} />
          ))}
        </Collapse>
      </CardContent>
      <CardActions>
        <Button onClick={() => setExpanded(! expanded)}>
          {expanded ? "Свернуть" : `Раскрыть (${pages.length})`}
        </Button>

        {/* Karma */}
        <Button size="small" style={{marginLeft: "auto"}}>
          <Comment fontSize="small" style={{marginRight: 5}} />
          {props.post.subUnitsCount}
        </Button>
        <IconButton
          size="small"
          disabled={!!(props.post.myKarma || voted)}
          onClick={() => addKarma(false)}
        >
          <ArrowDownward htmlColor={props.post.myKarma < 0 ? theme.palette.success.main : null } />
        </IconButton>
        <span style={{
          color:
            props.post.karmaCount > 0 ? theme.palette.success.main :
            props.post.karmaCount < 0 ? theme.palette.error.main :
            theme.palette.text.primary,
          fontWeight: "bold"
        }}>
          {(props.post.karmaCount + voted) / 100}
        </span>
        <IconButton
          size="small"
          disabled={!! (props.post.myKarma || voted)}
          onClick={() => addKarma(true)}
        >
          <ArrowUpward htmlColor={props.post.myKarma > 0 ? theme.palette.success.main : null } />
        </IconButton>
      </CardActions>
    </Card>
  );
}

export default PostCard;
