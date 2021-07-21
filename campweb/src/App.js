import './App.css';
import { createMuiTheme, ThemeProvider, CssBaseline, Box, Snackbar, AppBar, Toolbar, Slide, useScrollTrigger } from '@material-ui/core';
import {Router, Switch, Route, useHistory, Redirect} from "react-router-dom";
import Login from "./pages/Login";
import { ApiClient, ApiContext } from './api/ApiContext';
import Feed from './pages/Feed';
import {useContext, useState} from 'react';
import { Alert } from '@material-ui/lab';
import Post from "./pages/Post";
import AppToolbar from './components/AppToolbar';
import Profile from './pages/Profile';
import ProfileKarma from './pages/profile/Karma';
import Achievements from './pages/profile/Achievements';
import Create from "./pages/drafts/Create";
import Settings from "./pages/Settings";
import {createBrowserHistory} from "history";
import {wrapHistory} from "oaf-react-router";
import Drafts from "./pages/drafts/Drafts";
import Publish from "./pages/drafts/Publish";

export const theme = createMuiTheme({
  palette: {
    type: "dark",
    background: {
      default: "#030303",
      paper: "#212121"
    },
    primary: {
      main: "#ff6c01"
    },
    success: {
      main: "#4cb14e"
    },
    info: {
      main: "#1d96fb"
    },
    error: {
      main: "#f24239"
    },
    warning: {
      main: "#ff770b"
    }
  }
}, {
  avatarVariant: window.localStorage.getItem("avatarVariant") || "rounded"
});

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

const browserHistory = createBrowserHistory();
wrapHistory(browserHistory, {
  disableAutoScrollRestoration: false,
  restorePageStateOnPop: true
});

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

  return (
    <ThemeProvider theme={theme}>
      <ApiContext.Provider value={client}>
        <Router history={browserHistory}>
          <HideOnScroll>
            <AppBar color="default" position="fixed">
              <AppToolbar />
            </AppBar>
          </HideOnScroll>
          <Toolbar />
          <Box
            component="main"
            style={{
              minHeight: "100vh"
            }}
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

              <PrivateRoute path="/post/:postId"><Post /></PrivateRoute>

              <PrivateRoute path="/drafts/" exact><Drafts /></PrivateRoute>
              <PrivateRoute path="/drafts/:draftId" exact><Create /></PrivateRoute>
              <PrivateRoute path="/drafts/:draftId/publish" exact><Publish /></PrivateRoute>

              <PrivateRoute path="/account/:accountId" exact><Profile /></PrivateRoute>
              <PrivateRoute path="/account/:accountId/karma" exact><ProfileKarma /></PrivateRoute>
              <PrivateRoute path="/account/:accountId/achievements" exact><Achievements /></PrivateRoute>
            </Switch>
          </Box>
          <Snackbar open={!!error} autoHideDuration={5000} onClose={closeSnackbar}>
            <Alert onClose={closeSnackbar} severity="error">{error}</Alert>
          </Snackbar>
        </Router>
      </ApiContext.Provider>
    </ThemeProvider>
  );
}

export default App;
