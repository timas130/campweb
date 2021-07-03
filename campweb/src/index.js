import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as Sentry from "@sentry/react";
import {Integrations} from "@sentry/tracing";

Sentry.init({
  dsn: "https://57cfc8ba87ce454f8ddba4f91773d2f0@o911018.ingest.sentry.io/5846009",
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 0.4
});

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
