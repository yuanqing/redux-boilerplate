var CleanPlugin = require('clean-webpack-plugin');
var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;
var webpack = require('webpack');

var config = require('./config');

var outputDirectoryName = 'build';
var outputPath = resolve(__dirname, outputDirectoryName);

var babelrcPath = resolve(__dirname, '.babelrc');
var babelrc = JSON.parse(readFileSync(babelrcPath, 'utf8'));
var babelLoaderQuery = Object.assign({}, babelrc,
  babelrc.env && babelrc.env.development || {});
delete babelLoaderQuery.env;

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './src/client'
  ],
  output: {
    path: outputPath,
    filename: 'bundle.js',
    publicPath: 'http://' + config.host + ':' + config.port + '/' + outputDirectoryName
  },
  module: {
    loaders: [
      {
        test: /.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: babelLoaderQuery
      }
    ]
  },
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
    new CleanPlugin([outputPath]),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};
