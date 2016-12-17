'use strict'

const webpackConfig = require('../webpack/webpack.config.dev.app')

module.exports = grunt => {
  return {
    options: {
      webpack: webpackConfig
    },

    default: {
      keepAlive: true,
      webpack: {
        debug: grunt.option('debug')
      }
    }
  }
}
