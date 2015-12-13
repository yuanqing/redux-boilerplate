import compression from 'compression';
import express from 'express';
import { fetchAllData } from 'fetch-data';
import { readFileSync } from 'fs';
import lodashTemplate from 'lodash.template';
import { resolve } from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux'
import { match, RoutingContext } from 'react-router';
import serveFavicon from 'serve-favicon';
import createLocation from 'history/lib/createLocation';

import config from '../config';
import routes from './routes';
import reducer from './reducer';
import createStore from './create-store';
import webpackDevConfig from '../webpack-dev-config';

import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const getStatusCode = (routes) => {
  return routes.reduce((previousRoute, currentRoute) => {
    return currentRoute.status || previousRoute;
  });
};

const app = express();

app.disable('x-powered-by');

app.use(compression());

app.use(serveFavicon(resolve(__dirname, '..', 'assets', 'favicon.ico')));

const isDevelopment = process.env.NODE_ENV !== 'production';
if (isDevelopment) {
  const compiler = webpack(webpackDevConfig);
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackDevConfig.output.publicPath
  }));
  app.use(webpackHotMiddleware(compiler));
}

app.use('/assets', express.static(resolve(__dirname, '..', 'assets')));
app.use('/build', express.static(resolve(__dirname, '..', 'build')));

const template = lodashTemplate(readFileSync(resolve(__dirname, 'template.html'), 'utf8'));

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

const port = config.port;
app.listen(port, () => {
  console.info('Listening on port %d', port);
});
