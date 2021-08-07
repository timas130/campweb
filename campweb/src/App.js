import './App.css';
import {
  CssBaseline,
  Box,
  Snackbar,
  AppBar,
  Toolbar,
  Slide,
  useScrollTrigger,
  BottomNavigation,
  BottomNavigationAction,
  Backdrop,
  Paper,
  ListItem, ListItemAvatar, List, ListItemText, LinearProgress, Typography
} from '@material-ui/core';
import {Switch, Route, Redirect, useHistory} from "react-router-dom";
import Login from "./pages/Login";
import { ApiClient, ApiContext } from './api/ApiContext';
import Feed from './pages/Feed';
import {useContext, useEffect, useState} from 'react';
import { Alert } from '@material-ui/lab';
import Post from "./pages/Post";
import AppToolbar from './components/AppToolbar';
import Profile from './pages/Profile';
import ProfileKarma from './pages/profile/Karma';
import Achievements from './pages/profile/Achievements';
import Create from "./pages/drafts/Create";
import Settings from "./pages/Settings";
import Drafts from "./pages/drafts/Drafts";
import Publish from "./pages/drafts/Publish";
import { Menu, Notifications, RssFeed, Star } from '@material-ui/icons';
import CampfireAvatar from "./components/CampfireAvatar";
import RAchievementsQuestInfo from "./api/requests/achievements/RAchievementsQuestInfo";
import quests from "./api/consts/Quests";

const client = new ApiClient();

// just stolen from the docs lol
function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({ target: window ? window() : undefined });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

function LinearProgressWithLabel(props) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box>
        <Typography variant="body2" color="textSecondary">
          {props.label}
        </Typography>
      </Box>
    </Box>
  );
}

function PrivateRoute(props) {
  const apiClient = useContext(ApiContext);
  const {children, ...rest} = props;
  return <Route
    {...rest}
    render={
      ({ location }) =>
        apiClient.loginInfo ?
        children :
        <Redirect to={{pathname: "/login", state: {next: location}}} />
    } />;
}

function App() {
  const history = useHistory();
  const [error, setError] = useState(null);

  client.onUnauthorized = () => {
    history.push("/login");
  };
  client.onError = (e) => {
    console.log("request error:", e);
    setError(e);
  };
  const closeSnackbar = (ev, reason) => {
    reason !== "clickaway" && setError(null);
  };

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);

  const [navTab, setNavTab] = useState("feed");
  const [menuOpen, setMenuOpen] = useState(false);
  const [randomPhraseNum,] = useState(Math.floor(Math.random() * 61) + 1);

  const [dailyQuest, setDailyQuest] = useState(null);
  async function loadQuest() {
    if (! client.loginInfo) return;
    const resp = await client.makeRequest(new RAchievementsQuestInfo());
    setDailyQuest(resp);
  }
  useEffect(() => {
    loadQuest();
  }, []);
  client.onLogin = loadQuest;
  const dailyQuestTarget = dailyQuest ? quests[dailyQuest.questIndex]
    .getTarget(client.loginInfo.account["J_LVL"]) : 0;

  return (
    <ApiContext.Provider value={client}>
      <HideOnScroll>
        <AppBar color="default" position="fixed">
          <AppToolbar />
        </AppBar>
      </HideOnScroll>
      <Toolbar />
      <Box
        component="main"
        minHeight="100vh"
        paddingBottom="60px"
      >
        <CssBaseline />
        <Switch>
          <Route path="/" exact><Redirect to="/feed" /></Route>
          <Route path="/login"><Login /></Route>
          <PrivateRoute path="/settings"><Settings /></PrivateRoute>
          <PrivateRoute path="/feed">
            <Feed
              posts={posts} setPosts={setPosts}
              loading={loading} setLoading={setLoading}
              tab={tab} setTab={setTab}
            />
          </PrivateRoute>

          <Route path="/post/:postId"><Post /></Route>

          <PrivateRoute path="/drafts/" exact><Drafts /></PrivateRoute>
          <PrivateRoute path="/drafts/:draftId" exact><Create /></PrivateRoute>
          <PrivateRoute path="/drafts/:draftId/publish" exact><Publish /></PrivateRoute>

          <PrivateRoute path="/account/:accountId" exact><Profile /></PrivateRoute>
          <PrivateRoute path="/account/:accountId/karma" exact><ProfileKarma /></PrivateRoute>
          <PrivateRoute path="/account/:accountId/achievements" exact><Achievements /></PrivateRoute>
        </Switch>
        <Toolbar />
      </Box>
      <Snackbar open={!!error} autoHideDuration={5000} onClose={closeSnackbar}>
        <Alert onClose={closeSnackbar} severity="error">{error}</Alert>
      </Snackbar>

      <BottomNavigation value={navTab} style={{
        position: "fixed",
        width: "100%",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 500
      }} onChange={(ev, value) => {
        switch (value) {
          case "achievements":
            history.push(`/account/${client.loginInfo.account.J_ID}/achievements`);
            setNavTab(value);
            break;
          case "feed":
            history.push("/feed");
            setNavTab(value);
            break;
          case "notifications":
            history.push("/notifications");
            setNavTab(value);
            break;
          case "menu":
            setMenuOpen(true);
            break;
          default:
            break;
        }
      }}>
        <BottomNavigationAction value="achievements" label="Достижения" icon={<Star />} />
        <BottomNavigationAction value="feed" label="Фид" icon={<RssFeed />} />
        <BottomNavigationAction value="notifications" label="Уведомления" icon={<Notifications />} />
        <BottomNavigationAction value="menu" label="Меню" icon={<Menu />} />
      </BottomNavigation>
      <Backdrop open={menuOpen} style={{zIndex: 1000}} onClick={() => setMenuOpen(false)}>
        <Paper style={{
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          maxWidth: 540,
          width: "100%"
        }}>
          <List onClick={() => {}}>
            {client.loginInfo ? <ListItem button onClick={() => {
              history.push(`/account/${client.loginInfo.account["J_ID"]}`);
            }}>
              <ListItemAvatar>
                <CampfireAvatar account={client.loginInfo.account} />
              </ListItemAvatar>
              <ListItemText
                primary={client.loginInfo.account["J_NAME"]}
                secondary={client.translate("profile_subtitle_text_" + randomPhraseNum)}
              />
            </ListItem> : ""}
            {dailyQuest ? <ListItem button onClick={loadQuest}>
              <ListItemText
                primary={client.translate("quests_text_" + quests[dailyQuest.questIndex].name)}
                secondary={
                  <LinearProgressWithLabel variant="determinate" value={
                    (dailyQuest.questProgress / dailyQuestTarget) * 100
                  } label={
                    dailyQuest.questProgress + "/" + dailyQuestTarget
                  } />
                }
              />
            </ListItem> : ""}
          </List>
        </Paper>
      </Backdrop>
    </ApiContext.Provider>
  );
}

export default App;
