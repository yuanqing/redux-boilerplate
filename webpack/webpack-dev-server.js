const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');

const config = require('../config').development.webpackDevServer;
const webpackDevConfig = require('./webpack-dev-config');

const webpackOptions = {
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

const app = express();

const compiler = webpack(webpackDevConfig);

app.use(webpackDevMiddleware(compiler, webpackOptions));
app.use(webpackHotMiddleware(compiler));

app.listen(config.port, (err) => {
  if (err) {
    return console.error(err);
  }
  console.info('Webpack dev server listening on port %s', config.port);
});
