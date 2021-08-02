import { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { ApiContext } from "../api/ApiContext";
import { theme } from "../index";
import { CircularProgress, Collapse, Container, withStyles } from "@material-ui/core";
import RAccountsGet from "../api/requests/accounts/RAccountsGet";
import RAccountsGetProfile from "../api/requests/accounts/RAccountsGetProfile";
import CampfireImage from "../components/CampfireImage";
import { Card, CardContent, Divider, Typography, Chip, Paper, List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import CampfireAvatar from "../components/CampfireAvatar";
import moment from "moment";
import FormattedText from "../components/FormattedText";
import { AccountBalance, InsertEmoticon, People, Security, Spa, Star, ThumbsUpDown, Warning } from "@material-ui/icons";
import RPublicationsGetAll from "../api/requests/post/RPublicationsGetAll";
import API from "../api/api.json";
import InView from "react-intersection-observer";
import PostCard from "../components/PostCard";
import Comment from "../components/Comment";

function isOnline(account) {
  return account["J_LAST_ONLINE_DATE"] > new Date().getTime() - 900000;
}

const ListItemTextOverflowable = withStyles({
  secondary: {
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    overflow: "hidden"
  }
})(ListItemText);

function Profile() {
  const { accountId } = useParams();
  const history = useHistory();
  const apiClient = useContext(ApiContext);

  const [account, setAccount] = useState(null);
  const [profile, setProfile] = useState(null);
  const [expanded, setExpanded] = useState(false);

  const [pubs, setPubs] = useState([]);
  const [pubsEnd, setPubsEnd] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const account = apiClient.makeRequest(
        new RAccountsGet(
          isNaN(parseInt(accountId)) ? null : accountId,
          isNaN(parseInt(accountId)) ? accountId : null
        )
      );
      const profile = apiClient.makeRequest(
        new RAccountsGetProfile(
          isNaN(parseInt(accountId)) ? null : accountId,
          isNaN(parseInt(accountId)) ? accountId : null
        )
      );
      setAccount((await account).account);
      setProfile(await profile);
      console.log((await account).account);
      console.log(await profile);
    }
    loadProfile();
  }, [accountId, apiClient]);

  async function loadMorePubs() {
    const req = new RPublicationsGetAll(
      // TODO: moderation pubs, other events
      [API["PUBLICATION_TYPE_POST"], API["PUBLICATION_TYPE_COMMENT"]],
      pubs.length // why is offset counted differently here?
    );
    req.accountId = account["J_ID"];
    let resp = await apiClient.makeRequest(req);
    resp = JSON.parse(resp.units);
    console.log(resp);
    setPubs([...pubs, ...resp]);
    if (resp.length < req.count) setPubsEnd(true);
  }

  return (
    <Container maxWidth="sm">
      {
        profile ?
        <div>
          { /* Title image */
            profile.titleImageId ?
            <CampfireImage id={profile.titleImageId} style={{
              width: "100%",
              maxHeight: 198,
              marginBottom: 10
            }} backdrop /> :
            ""
          }
          {/* Title */}
          <Card style={{marginBottom: 10}}>
            <CardContent style={{display: "flex", padding: 16}}>
              <div>
                <CampfireAvatar style={{marginRight: 10}} account={account} backdrop />
              </div>
              <div>
                <Typography variant="body1">
                  {account["J_NAME"]}
                </Typography>
                <Typography variant="body2" style={{
                  color: 
                    (account["J_NAME"].startsWith("Bot#") || isOnline(account)) ?
                    theme.palette.success.light : theme.palette.text.secondary
                }}>
                  {
                    account["J_NAME"].startsWith("Bot#") ?
                    "Бот" :
                    isOnline(account) ?
                    "Онлайн" :
                    "Был онлайн " + moment(account["J_LAST_ONLINE_DATE"])
                      .locale("ru").calendar().toLowerCase()
                  }
                </Typography>
              </div>
              <div style={{marginLeft: "auto"}}>
                <Typography variant="body2" color="textSecondary" align="right">
                  {moment(profile.dateCreate).locale("ru").toNow(true)} с нами
                </Typography>
              </div>
            </CardContent>
            {
              account.sponsor ?
              <CardContent style={{padding: 16, paddingTop: 0, textAlign: "center"}}>
                <Chip
                  style={{
                    background: theme.palette.success.main,
                    color: theme.palette.success.contrastText
                  }}
                  label={"Спонсор " + (account.sponsor / 100).toFixed(0) + "₽"}
                />
              </CardContent> :
              ""
            }
          </Card>
          {/* Status */}
          <Card style={{marginBottom: 10}}>
            <CardContent style={{padding: 16}}>
              <Typography variant="body1" align="center">
                <FormattedText text={profile.status || "Hello, world!"} />
              </Typography>
            </CardContent>
          </Card>
          {/* Actions/information */}
          <Paper style={{marginBottom: 10}}>
            <List>
              <ListItem button onClick={() => history.push(`/account/${account["J_ID"]}/karma`)}>
                <ListItemIcon><Star /></ListItemIcon>
                <ListItemText
                  primary="Карма"
                  secondary={<>
                    За 30 дней:&nbsp;
                    <span style={{color: theme.palette.success.light}}>
                      {(account.karma30 / 100).toFixed()}
                    </span>.
                    Всего:&nbsp;
                    <span style={{color: theme.palette.success.light}}>
                      {(profile.karmaTotal / 100).toFixed()}
                    </span>.
                  </>}
                />
              </ListItem>
              <ListItem button onClick={() => history.push(`/account/${account["J_ID"]}/achievements`)}>
                <ListItemIcon><Star /></ListItemIcon>
                <ListItemText
                  primary="Достижения"
                  secondary={account["J_LVL"] / 100}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon><Security /></ListItemIcon>
                <ListItemText
                  primary="Наказания"
                  secondary={
                    "Баны: " + profile.bansCount + ". " +
                    "Предупреждения: " + profile.warnsCount + "."
                  }
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon><People /></ListItemIcon>
                <ListItemText
                  primary="Подписчики"
                  secondary={profile.followersCount}
                />
              </ListItem>
              <ListItem button>
                <ListItemIcon><People /></ListItemIcon>
                <ListItemText
                  primary="Подписки"
                  secondary={profile.followsCount}
                />
              </ListItem>
            </List>
            <Divider />
            <Collapse in={expanded}>
              <List>
                <ListItem button>
                  <ListItemIcon><AccountBalance /></ListItemIcon>
                  <ListItemText primary="Фэндомы" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon><ThumbsUpDown /></ListItemIcon>
                  <ListItemText primary="Оценки" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon><Spa /></ListItemIcon>
                  <ListItemText primary="Статистика" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon><InsertEmoticon /></ListItemIcon>
                  <ListItemText primary="Стикеры" />
                </ListItem>
                <ListItem button>
                  <ListItemIcon><Warning /></ListItemIcon>
                  <ListItemText primary="Чёрный список" />
                </ListItem>
              </List>
            </Collapse>
            <List>
              <ListItem button onClick={() => setExpanded(! expanded)}>
                <ListItemText primary={
                  expanded ? "Скрыть подробности" : "Показать подробности"
                } />
              </ListItem>
            </List>
          </Paper>
          {/* Bio */}
          <Paper style={{marginBottom: 10}}>
            <List>
              <ListItem button>
                <ListItemText primary={
                  "Обращение: " + (account.sex ? "Она" : "Он")
                } />
              </ListItem>
              <ListItem button>
                <ListItemText primary={
                  "Возраст: " + profile.age
                } />
              </ListItem>
            </List>
            <Divider />
            <List>
              <ListItem>
                <Typography variant="body1">
                  <FormattedText text={profile.description} />
                </Typography>
              </ListItem>
              {JSON.parse(profile.links.links)
                .map((link, idx) => (
                  link.url ?
                  <ListItem button key={idx}
                    onClick={() => window.open(link.url, "_blank")}>
                    <ListItemTextOverflowable
                      primary={link.title}
                      secondary={link.url}
                    />
                  </ListItem> :
                  ""
                ))}
            </List>
          </Paper>

          {/* Publications */}
          <List>{pubs.map(pub => {
            if (pub.unitType === API["PUBLICATION_TYPE_POST"]) {
              return <PostCard key={pub.id} post={pub} />;
            } else if (pub.unitType === API["PUBLICATION_TYPE_COMMENT"]) {
              return <Comment fandomAvatar key={pub.id} comment={pub} />;
            } else {
              return "";
            }
          })}</List>
          {
            !pubsEnd &&
            <InView
              as="div"
              onChange={(inView) => inView && loadMorePubs()}
              style={{width: "100%", padding: 20, textAlign: "center"}}
            >
              <CircularProgress />
            </InView>
          }
        </div> :
        <div style={{
          textAlign: "center",
          width: "100%",
          padding: 20
        }}>
          <CircularProgress />
        </div>
      }
    </Container>
  );
}

export default Profile;
