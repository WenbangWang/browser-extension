'use strict'

const webpackConfig = require('../webpack.config')

module.exports = grunt => {
  return {
    options: {
      webpack: webpackConfig
    },

    start: {
      keepAlive: true,
      webpack: {
        devtool: '#inline-source-map',
        debug: grunt.option('debug')
      }
    }
  }
}
