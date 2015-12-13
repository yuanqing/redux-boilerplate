import fetch from '../fetch';

export function getAllProducts(query) {
  return fetch('products');
}
