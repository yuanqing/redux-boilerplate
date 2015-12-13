import fetch from '../fetch';

export function getAllProducts() {
  return fetch('products');
}
