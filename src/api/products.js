import fetch from 'isomorphic-fetch';

export function getAllProducts(query) {
  return fetch('http://localhost:3000/products').then(function(response) {
    return Promise.resolve(response.json());
  });
}
