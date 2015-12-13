import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App/App';
import Products from './containers/Products/Products';

export default (
  <Route path='/' component={App} >
    <IndexRoute component={Products} />
  </Route>
);
