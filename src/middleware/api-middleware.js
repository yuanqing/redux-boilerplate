export default function apiMiddleware(api) {
  return ({ dispatch, getState }) => {
    return next => action => {
      if (typeof action === 'function') {
        return action(dispatch, getState);
      }
      const { types, promise, payload } = action;
      if (!promise) {
        return next(action);
      }
      const { REQUEST, SUCCESS, FAILURE } = types;
      next({ type: REQUEST, payload });
      return promise(api).then(
        (result) => {
          next({
            type: SUCCESS,
            payload: result
          });
        },
        (error) => {
          next({
            type: FAILURE,
            payload: error
          });
        }
      ).catch((error)=> {
        console.error('Middleware error');
        next({
          type: FAILURE,
          payload: error
        });
      });
    };
  };
}
