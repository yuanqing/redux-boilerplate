module.exports = {
  development: {
    app: {
      protocol: 'http',
      host: 'localhost',
      port: 4200
    },
    webpackDevServer: {
      protocol: 'http',
      host: 'localhost',
      port: 4201
    },
    api: {
      protocol: 'http',
      host: 'localhost',
      port: 3000
    }
  },
  production: {
    app: {
      protocol: 'http',
      host: 'localhost',
      port: 4200
    },
    api: {
      protocol: 'http',
      host: 'localhost',
      port: 3000
    }
  }
};
