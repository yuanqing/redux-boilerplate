var fs = require('fs');

var babelrc = fs.readFileSync('./.babelrc', 'utf8');

var config;
try {
  config = JSON.parse(babelrc);
} catch (err) {
  console.error('Error parsing `.babelrc`.');
  console.error(err);
}

require('babel-core/register')(config);
require('./src/server');
