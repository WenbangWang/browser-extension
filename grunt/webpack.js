'use strict'

const webpackConfig = require('../webpack/webpack.config.dev.extension')

module.exports = grunt => {
  return {
    options: webpackConfig,

    default: {
      debug: grunt.option('debug')
    }
  }
}
