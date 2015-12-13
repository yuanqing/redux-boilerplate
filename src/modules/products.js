import createActions from '../create-actions';

const GET_ALL_PRODUCTS = createActions('GET_ALL_PRODUCTS');

const initialState = {
  pending: true,
  products: []
};

export default function reducer(state = initialState, action = {}) {
  const payload = action.payload;
  switch (action.type) {
    case GET_ALL_PRODUCTS.REQUEST:
      return {
        ...state,
        pending: true
      };
    case GET_ALL_PRODUCTS.SUCCESS:
      return {
        ...state,
        pending: false,
        items: payload
      };
    case GET_ALL_PRODUCTS.FAILURE:
      console.error('GET_ALL_PRODUCTS.FAILURE', payload);
      return state;
    default:
      return state;
  }
}

export function getAllProducts() {
  return {
    types: GET_ALL_PRODUCTS,
    promise: (api) => {
      return api.products.getAllProducts();
    }
  };
}
