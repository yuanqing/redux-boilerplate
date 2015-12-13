const readFileSync = require('fs').readFileSync;
const resolve = require('path').resolve;
const webpack = require('webpack');
const WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

const config = require('../config').development.webpackDevServer;

const rootDirectory = resolve(__dirname, '..');

const outputDirectoryName = 'build';
const outputPath = resolve(rootDirectory, outputDirectoryName);

const babelrcPath = resolve(rootDirectory, '.babelrc');
const babelrc = JSON.parse(readFileSync(babelrcPath, 'utf8'));
const babelLoaderQuery = Object.assign({}, babelrc,
  babelrc.env && babelrc.env.development || {});
babelLoaderQuery.extra['react-transform'].transforms.push({
  transform: 'react-transform-hmr',
  imports: ['react'],
  locals: ['module']
});
delete babelLoaderQuery.env;

const webpackIsomorphicToolsConfig = require('./webpack-isomorphic-tools-config');
const webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig);

module.exports = {
  devtool: 'inline-source-map',
  context: rootDirectory,
  entry: {
    'main': [
      'webpack-hot-middleware/client?path=' + config.protocol + '://' + config.host + ':' + config.port + '/__webpack_hmr',
      './src/client.js'
    ]
  },
  output: {
    path: outputPath,
    filename: '[name]-[hash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: config.protocol + '://' + config.host + ':' + config.port + '/' + outputDirectoryName + '/'
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
