import isomorphicFetch from 'isomorphic-fetch';

import config from '../config';

const { protocol, host, port } = config[process.env.NODE_ENV || 'development'].api;

const urlPrefix = protocol + '://' + host + (typeof port === 'undefined' || port === 80 ? '' : ':' + port) + '/';

export default function(endpoint) {
  return isomorphicFetch(urlPrefix + endpoint).then((response) => {
    return Promise.resolve(response.json());
  });
}
