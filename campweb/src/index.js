import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as Sentry from "@sentry/react";
import {Integrations} from "@sentry/tracing";
import {createMuiTheme, ThemeProvider} from "@material-ui/core";
import {Router} from "react-router-dom";
import {createBrowserHistory} from "history";
import {wrapHistory} from "oaf-react-router";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: "https://57cfc8ba87ce454f8ddba4f91773d2f0@o911018.ingest.sentry.io/5846009",
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1
  });
}

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

const browserHistory = createBrowserHistory();
wrapHistory(browserHistory, {
  disableAutoScrollRestoration: false,
  restorePageStateOnPop: true
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <Router history={browserHistory}>
      <App />
    </Router>
  </ThemeProvider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
