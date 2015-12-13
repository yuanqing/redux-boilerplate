import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import { syncReduxAndRouter } from 'redux-simple-router';

import createStore from './create-store';
import reducer from './reducer';
import routes from './routes';

const history = createBrowserHistory();
const store = createStore(reducer, window.__STATE__);

syncReduxAndRouter(history, store);

render((
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>
), document.getElementById('app'));
