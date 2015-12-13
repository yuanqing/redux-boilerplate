var express = require('express');
var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var config = require('../config');
var webpackDevConfig = require('./webpack-dev-config');

var host = config.host;
var port = config.port + 1;

var webpackOptions = {
  contentBase: 'http://' + host + ':' + port,
  quiet: true,
  noInfo: true,
  hot: true,
  inline: true,
  lazy: false,
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

app.listen(port, function(err) {
  if (err) {
    return console.error(err);
  }
  console.info('Webpack dev server listening on port %s', port);
});
