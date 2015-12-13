var readFileSync = require('fs').readFileSync;
var resolve = require('path').resolve;

var babelrcPath = resolve(__dirname, '..', '.babelrc');
var babelrc = JSON.parse(readFileSync(babelrcPath, 'utf8'));
require('babel-core/register')(babelrc);
require('./server');
