const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
const WebpackIsomorphicTools = require('webpack-isomorphic-tools');

const webpackIsomorphicToolsConfig = require('../webpack/webpack-isomorphic-tools-config');

const rootDirectory = resolve(__dirname, '..');

const babelrcPath = resolve(rootDirectory, '.babelrc');
const babelrc = JSON.parse(readFileSync(babelrcPath, 'utf8'));
require('babel-core/register')(babelrc);

const webpackIsomorphicTools = new WebpackIsomorphicTools(webpackIsomorphicToolsConfig);
webpackIsomorphicTools
  .development(process.env.NODE_ENV !== 'production')
  .server(rootDirectory, () => {
    require('./server')(webpackIsomorphicTools);
  });
