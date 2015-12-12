var path = require('path');
var Clean = require('clean-webpack-plugin');

var BUILD_DIR = path.resolve(__dirname, 'build');

module.exports = {
  entry: './src/client.js',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: { stage: 0 }
      }
    ]
  },
  resolve: {
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    extensions: ['', '.js', '.json']
  },
  plugins: [
    new Clean([BUILD_DIR])
  ]
};
