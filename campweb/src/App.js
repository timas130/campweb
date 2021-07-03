import './App.css';
import { createMuiTheme, ThemeProvider, CssBaseline, Box, Snackbar, AppBar, Toolbar, Slide, useScrollTrigger } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, useHistory, Redirect } from "react-router-dom";
import Login from "./pages/Login";
import { ApiClient, ApiContext } from './api/ApiContext';
import Feed from './pages/Feed';
import { useEffect, useState } from 'react';
import { Alert } from '@material-ui/lab';
import Post from "./pages/Post";
import AppToolbar from './components/AppToolbar';
import Profile from './pages/Profile';
import ProfileKarma from './pages/profile/Karma';
import Achievements from './pages/profile/Achievements';

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
  avatarVariant: "rounded"
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

export const useLoggedIn = (history, apiClient) => {
  useEffect(() => {
    if (! apiClient.loginInfo) {
      const params = new URLSearchParams();
      params.append("next", history.location.pathname);
      history.push({
        pathname: "/login",
        search: params.toString()
      });
    }
  });
};
export const useScrollToTop = () => {
  useEffect(() => {
    const scrollY = window.scrollY;
    window.scroll(0, 0);
    return () => window.scroll(0, scrollY);
  }, []);
};

function App() {
  const history = useHistory();
  const [error, setError] = useState(null);

  client.onUnauthorized = () => {
    history.push("/login");
  };
  client.onError = (e) => {
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
        <Router>
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
              <Route path="/" exact><Redirect to="/login" /></Route>
              <Route path="/login"><Login /></Route>
              <Route path="/feed">
                <Feed
                  posts={posts} setPosts={setPosts}
                  loading={loading} setLoading={setLoading}
                  tab={tab} setTab={setTab}
                />
              </Route>

              <Route path="/post/:postId"><Post /></Route>

              <Route path="/account/:accountId" exact><Profile /></Route>
              <Route path="/account/:accountId/karma" exact><ProfileKarma /></Route>
              <Route path="/account/:accountId/achievements" exact><Achievements /></Route>
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
