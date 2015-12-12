import compression from 'compression';
import express from 'express';
import { readFileSync } from 'fs';
import lodashTemplate from 'lodash.template';
import { resolve } from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux'
import { match, RoutingContext } from 'react-router';
import serveFavicon from 'serve-favicon';
import createLocation from 'history/lib/createLocation';

import routes from './routes';
import reducer from './reducer';
import createStore from './create-store';
import { fetchAllData } from 'fetch-data';

const getStatusCode = (routes) => {
  return routes.reduce((previousRoute, currentRoute) => {
    return currentRoute.status || previousRoute;
  });
};

// TODO
const PORT = 4242;

const template = lodashTemplate(readFileSync(resolve(__dirname, 'index.html'), 'utf8'));

const app = express();

app.disable('x-powered-by');

app.use(compression());

app.use(serveFavicon(resolve(__dirname, '..', 'assets', 'favicon.ico')));

app.use('/assets', express.static(resolve(__dirname, '..', 'assets')));
app.use('/build', express.static(resolve(__dirname, '..', 'build')));

app.use((req, res) => {
  const location = createLocation(req.originalUrl);
  const store = createStore(reducer);
  match({ routes, location }, (error, redirectLocation, renderProps) => {
    fetchAllData(renderProps.components, store.getState, store.dispatch)
      .then(() => {
        if (redirectLocation) {
          return res.status(302).redirect(redirectLocation.pathname + redirectLocation.search);
        }
        if (error) {
          return res.status(500).send(error.message);
        }
        const statusCode = getStatusCode(renderProps.routes);
        if (statusCode) {
          res.status(statusCode);
        }
        res.send(template({
          app: renderToString(
            <Provider store={store}>
              <RoutingContext {...renderProps} />
            </Provider>
          ),
          state: JSON.stringify(store.getState())
        }));
      })
      .catch((error) => {
        res.status(500).send(error.message);
      });
  });
});

app.listen(PORT, () => {
  console.info('Listening on port %d', PORT);
});
