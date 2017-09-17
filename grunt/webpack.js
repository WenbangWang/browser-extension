'use strict'

const webpack = require('webpack')
const webpackExtensionConfig = require('../webpack/webpack.config.dev.extension')
const webpackExtensionProdConfig = require('../webpack/webpack.config.prod.extension')
const webpackScriptProdConfig = require('../webpack/webpack.config.prod.script')
const webpackScriptConfig = require('../webpack/webpack.config.dev.script')
const webpackMerge = require('webpack-merge')

module.exports = grunt => {
  // noinspection WebpackConfigHighlighting
  return {
    extension: mergeWebpackConfig(grunt, webpackExtensionConfig),

    script: mergeWebpackConfig(grunt, webpackScriptConfig),

    'extension-prod': mergeWebpackConfig(grunt, webpackExtensionProdConfig),

    'script-prod': mergeWebpackConfig(grunt, webpackScriptProdConfig)
  }
}

function mergeWebpackConfig (grunt, config) {
  return webpackMerge(config, {
    plugins: [
      new webpack.LoaderOptionsPlugin({
        debug: grunt.option('debug')
      })
    ]
  })
}
