import { Card, CardHeader, CardContent, CardActions, Avatar, Link, Collapse, Button, IconButton } from "@material-ui/core";
import CampfireImage from "./CampfireImage";
import Pages from "./pages/Pages";
import moment from "moment";
import "moment/locale/ru";
import { useContext, useState } from "react";
import "./PostCard.css";
import {ArrowDownward, ArrowUpward, Comment, Edit} from "@material-ui/icons";
import { theme } from "../index";
import { ApiContext } from "../api/ApiContext";
import RPublicationsKarmaAdd from "../api/requests/post/RPublicationsKarmaAdd";
import { useHistory } from "react-router";
import Karma from "./Karma";
import UserActivity from "./pages/UserActivity";
import { Link as RouterLink } from "react-router-dom";

function PostCard(props) {
  // campfire in a nutshell
  const pages = JSON.parse(JSON.parse(props.post.jsonDB)["J_PAGES"]);

  const [expanded, setExpanded] = useState(!! props.fullPage);
  const [voted, setVoted] = useState(0);
  const apiClient = useContext(ApiContext);
  const history = useHistory();

  const myPost = props.post.creator["J_ID"] === (apiClient.loginInfo || {account: {J_ID: 0}}).account["J_ID"];

  const addKarma = async (up) => {
    // TODO: anonymous voting
    const resp = await apiClient.makeRequest(new RPublicationsKarmaAdd(
      props.post.id, up
    ));
    setVoted(resp.myKarmaCount);
  };

  return (<div style={{paddingBottom: 10, paddingTop: 10}}>
    <Card variant="outlined" style={{background: theme.palette.background.default}}>
      <CardHeader
        avatar={
          <Avatar variant={theme.avatarVariant}>
            <CampfireImage id={props.post.fandom.imageId}
              style={{width: "100%"}} />
          </Avatar>
        }
        title={props.post.fandom.name}
        subheader={
          <span>
            <Link
              component={RouterLink}
              to={`/account/${props.post.creator["J_ID"]}`}
            >
              {props.post.creator["J_NAME"]}
            </Link>
            &nbsp;{moment(props.post.dateCreate).locale("ru").calendar()}&nbsp;
            {
              props.post.userActivity ?
              <Link
                component={RouterLink}
                to={`/activity/${props.post.userActivity.id}`}
              >
                {props.post.userActivity.name}
              </Link> :
              ""
            }
            {
              props.post.rubricId ?
              <Link
                component={RouterLink}
                to={`/rubric/${props.post.rubricId}`}
              >
                {props.post.rubricName}
              </Link> :
              ""
            }
          </span>
        }
      />
      <CardContent>
        <Collapse collapsedHeight={250} in={expanded}>
          <Pages pages={pages} sourceId={props.post.id} />
          {
            props.post.userActivity && 
            <UserActivity activity={props.post.userActivity} />
          }
        </Collapse>
      </CardContent>
      <CardActions>
        {props.fullPage ? "" : <Button onClick={() => setExpanded(! expanded)}>
          {expanded ? "Свернуть" : `Раскрыть (${pages.length})`}
        </Button>}

        {
          props.draft ?
          <Button
            size="small" style={{marginLeft: "auto"}}
            onClick={() => history.push("/drafts/" + props.post.id)}
          >
            <Edit fontSize="small" style={{marginRight: 5}} />
            Изменить
          </Button> :
          <Button
            size="small" style={{marginLeft: "auto"}}
            onClick={() => history.push("/post/" + props.post.id)}
          >
            <Comment fontSize="small" style={{marginRight: 5}} />
            {props.post.subUnitsCount}
          </Button>
        }
        {/* Karma */}
        {!props.draft && <>
          <IconButton
            size="small" onClick={() => addKarma(false)}
            disabled={!! (myPost || props.post.myKarma || voted)}
          >
            <ArrowDownward htmlColor={props.post.myKarma < 0 ? theme.palette.success.main : null } />
          </IconButton>
          <Karma amount={props.post.karmaCount + voted} />
          <IconButton
            size="small" onClick={() => addKarma(true)}
            disabled={!! (myPost || props.post.myKarma || voted)}
          >
            <ArrowUpward htmlColor={props.post.myKarma > 0 ? theme.palette.success.main : null } />
          </IconButton>
        </>}
      </CardActions>
    </Card>
  </div>);
}

export default PostCard;
