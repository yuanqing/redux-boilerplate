var ExtractTextPlugin = require('extract-text-webpack-plugin');
var resolve = require('path').resolve;
var strip = require('strip-loader');
var webpack = require('webpack');
var WebpackIsomorphicToolsPlugin = require('webpack-isomorphic-tools/plugin');

var rootDirectory = resolve(__dirname, '..');

var outputDirectoryName = 'build';
var outputPath = resolve(rootDirectory, outputDirectoryName);

var webpackIsomorphicToolsConfig = require('./webpack-isomorphic-tools-config');
var webpackIsomorphicToolsPlugin = new WebpackIsomorphicToolsPlugin(webpackIsomorphicToolsConfig);

module.exports = {
  devtool: 'source-map',
  context: rootDirectory,
  entry: {
    'main': [
      './src/client.js'
    ]
  },
  output: {
    path: outputPath,
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    // TODO
    publicPath: '/' + outputDirectoryName + '/'
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loaders: [strip.loader('debug'), 'babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style', 'css?modules&importLoaders=2&sourceMap!autoprefixer?browsers=last 2 version!sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true')
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
    new ExtractTextPlugin('[name]-[chunkhash].css', {
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    webpackIsomorphicToolsPlugin
  ]
};
