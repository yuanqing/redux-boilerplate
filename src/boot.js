var readFileSync = require('fs').readFileSync;
var resolve = require('path').resolve;
var WebpackIsomorphicTools = require('webpack-isomorphic-tools');

var webpackIsomorphicToolsConfig = require('../webpack/webpack-isomorphic-tools-config');

var rootDirectory = resolve(__dirname, '..');

var babelrcPath = resolve(rootDirectory, '.babelrc');
var babelrc = JSON.parse(readFileSync(babelrcPath, 'utf8'));
require('babel-core/register')(babelrc);

var webpackIsomorphicTools = new WebpackIsomorphicTools(webpackIsomorphicToolsConfig);
webpackIsomorphicTools
  .development(process.env.NODE_ENV !== 'production')
  .server(rootDirectory, function() {
    require('./server')(webpackIsomorphicTools);
  });
