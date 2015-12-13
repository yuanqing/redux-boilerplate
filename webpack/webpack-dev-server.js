var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var config = require('../config').development.webpackDevServer;
var webpackDevConfig = require('./webpack-dev-config');

var webpackOptions = {
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
  contentBase: 'http://' + config.host + ':' + config.port,
  publicPath: webpackDevConfig.output.publicPath,
  headers: {
    'Access-Control-Allow-Origin': '*'
  },
  stats: {
    colors: true
  }
};

var app = express();

var compiler = webpack(webpackDevConfig);

app.use(webpackDevMiddleware(compiler, webpackOptions));
app.use(webpackHotMiddleware(compiler));

app.listen(config.port, function(err) {
  if (err) {
    return console.error(err);
  }
  console.info('Webpack dev server listening on port %s', config.port);
});
