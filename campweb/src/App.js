import './App.css';
import { createMuiTheme, ThemeProvider, CssBaseline, Box, Snackbar } from '@material-ui/core';
import { BrowserRouter as Router, Switch, Route, useHistory, Redirect } from "react-router-dom";
import Login from "./pages/Login";
import { ApiClient, ApiContext } from './api/ApiContext';
import Feed from './pages/Feed';
import { useState } from 'react';
import { Alert } from '@material-ui/lab';

export const theme = createMuiTheme({
  palette: {
    type: "dark",
    background: "#212121",
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
});

const client = new ApiClient();

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

  return (
    <ThemeProvider theme={theme}>
      <ApiContext.Provider value={client}>
        <Router>
          <Box
            component="main"
            style={{background: theme.palette.background, minHeight: "100vh"}}
          >
            <CssBaseline />
            <Switch>
              <Route path="/" exact><Redirect to="/login" /></Route>
              <Route path="/login"><Login /></Route>
              <Route path="/feed"><Feed /></Route>
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
