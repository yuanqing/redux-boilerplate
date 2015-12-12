import { applyMiddleware, createStore } from 'redux';
import reduxThunk from 'redux-thunk';

import api from './api/api';
import apiMiddleware from './middleware/api-middleware';

export default function(reducer, initialState) {
  return applyMiddleware(reduxThunk, apiMiddleware(api))(createStore)(reducer, initialState);
};
