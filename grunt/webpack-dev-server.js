'use strict'

const webpackConfig = require('../webpack/webpack.config.dev.app')

module.exports = (grunt, options) => {
  // noinspection WebpackConfigHighlighting
  return {
    options: {
      webpack: webpackConfig,
      proxy: {
        '/api': {
          target: `http://localhost:${options.stub.port}`,
          logLevel: 'info'
        },
        '/storage': {
          target: `http://localhost:${options.stub.port}`,
          logLevel: 'info'
        }
      },
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    },

    default: {
      keepalive: true,
      port: options.webpack.devServer.port
    }
  }
}
