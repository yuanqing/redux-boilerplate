var readFileSync = require('fs').readFileSync;
var resolve = require('path').resolve;
var webpack = require('webpack');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

var config = require('../config').development.webpackDevServer;

var rootDirectory = resolve(__dirname, '..');

var outputDirectoryName = 'build';
var outputPath = resolve(rootDirectory, outputDirectoryName);

var babelrcPath = resolve(rootDirectory, '.babelrc');
var babelrc = JSON.parse(readFileSync(babelrcPath, 'utf8'));
var babelLoaderQuery = Object.assign({}, babelrc,
  babelrc.env && babelrc.env.development || {});
babelLoaderQuery.extra['react-transform'].transforms.push({
  transform: 'react-transform-hmr',
  imports: ['react'],
  locals: ['module']
});
delete babelLoaderQuery.env;

var webpackIsomorphicToolsConfig = require('./webpack-isomorphic-tools-config');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig);

module.exports = {
  devtool: 'inline-source-map',
  context: rootDirectory,
  entry: {
    'main': [
      'webpack-hot-middleware/client?path=http://' + config.host + ':' + config.port + '/__webpack_hmr',
      './src/client.js'
    ]
  },
  output: {
    path: outputPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: 'http://' + config.host + ':' + config.port + '/' + outputDirectoryName + '/'
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: babelLoaderQuery
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.scss$/,
        loader: 'style!css?modules&importLoaders=2&sourceMap&localIdentName=[local]__[hash:base64:5]!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap'
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: webpackIsomorphicToolsPlugin.regular_expression('images'),
        loader: 'url-loader?limit=10240'
      }
    ]
  },
  progress: true,
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: [
      '',
      '.js',
      '.json'
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.IgnorePlugin(/webpack-stats\.json$/),
    webpackIsomorphicToolsPlugin.development()
  ]
};
