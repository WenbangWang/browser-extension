'use strict'

const webpackExtensionConfig = require('../webpack/webpack.config.dev.extension')
const webpackScriptConfig = require('../webpack/webpack.config.script')
const webpackMerge = require('webpack-merge')

module.exports = grunt => {
  return {
    app: webpackMerge(webpackExtensionConfig, {
      debug: grunt.option('debug')
    }),

    script: webpackMerge(webpackScriptConfig, {
      debug: grunt.option('debug')
    })
  }
}
