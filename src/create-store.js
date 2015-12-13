import { applyMiddleware, createStore, compose } from 'redux';
import reduxThunk from 'redux-thunk';

import api from './api/api';
import apiMiddleware from './middleware/api-middleware';

export default function(reducer, initialState) {

  if (process.env.NODE_ENV !== 'production' &&
    typeof window !== 'undefined' && window.devToolsExtension) {
    const { persistState } = require('redux-devtools');
    const store = compose(
      applyMiddleware(reduxThunk, apiMiddleware(api)),
      window.devToolsExtension(),
      persistState(
        window.location.href.match(/[?&]debug_session=([^&]+)\b/)
      )
    )(createStore)(reducer, initialState);
    module.hot.accept('./reducer', () => {
      store.replaceReducer(require('./reducer'));
    });
    return store;
  }

  return applyMiddleware(reduxThunk, apiMiddleware(api))(createStore)(reducer, initialState);

}
