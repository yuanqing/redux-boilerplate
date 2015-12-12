import { combineReducers } from 'redux';
import { routeReducer } from 'redux-simple-router';

import products from './modules/products';

export default combineReducers({
  routing: routeReducer,
  products
});
