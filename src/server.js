import compression from 'compression';
import DocumentMeta from 'react-document-meta';
import express from 'express';
import { fetchAllData } from 'fetch-data';
import { readFileSync } from 'fs';
import lodashTemplate from 'lodash.template';
import { resolve } from 'path';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { match, RoutingContext } from 'react-router';
import serveFavicon from 'serve-favicon';
import createLocation from 'history/lib/createLocation';

import config from '../config';
import routes from './routes';
import reducer from './reducer';
import createStore from './create-store';

const getStatusCode = (routes) => {
  return routes.reduce((previousRoute, currentRoute) => {
    return currentRoute.status || previousRoute;
  });
};

const rootDirectory = resolve(__dirname, '..');

const template = lodashTemplate(readFileSync(resolve(__dirname, 'template.html'), 'utf8'));

export default function(webpackIsomorphicTools) {

  const app = express();
  app.disable('x-powered-by');
  app.use(compression());
  app.use(serveFavicon(resolve(rootDirectory, 'assets', 'favicon.ico')));
  app.use('/assets', express.static(resolve(rootDirectory, 'assets')));
  app.use('/build', express.static(resolve(rootDirectory, 'build')));
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
          const assets = webpackIsomorphicTools.assets();
          res.send(template({
            meta: DocumentMeta.renderAsHTML(),
            styles: Object.keys(assets.styles).map((key) => {
              return assets.styles[key];
            }) || [],
            app: renderToString(
              <Provider store={store}>
                <RoutingContext {...renderProps} />
              </Provider>
            ),
            state: JSON.stringify(store.getState()),
            script: assets.javascript.main,
          }));
        })
        .catch((error) => {
          res.status(500).send(error.message);
        });
    });
  });
  const port = config[process.env.NODE_ENV || 'development'].app.port;
  app.listen(port, () => {
    console.info('App server listening on port %d', port);
  });

}
