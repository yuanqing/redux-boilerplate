var CleanPlugin = require('clean-webpack-plugin');
var resolve = require('path').resolve;
var readFileSync = require('fs').readFileSync;

var outputDirectory = resolve(__dirname, 'build');

var babelrcPath = resolve(__dirname, '.babelrc');
var babelrc = JSON.parse(readFileSync(babelrcPath, 'utf8'));
var babelLoaderQuery = Object.assign({}, babelrc,
  babelrc.env && babelrc.env.development || {});
delete babelLoaderQuery.env;

module.exports = {
  devtool: 'inline-source-map',
  entry: './src/client.js',
  output: {
    path: outputDirectory,
    filename: 'bundle.js',
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
    new CleanPlugin([outputDirectory])
  ]
};
