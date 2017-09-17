'use strict'

const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base.dev')
const path = require('path')
const {rootPath, webpackMergeCustomizer} = require('./helper')
const APP_MODE = require('../constants/APP_MODE')

const config = webpackMerge(webpackMergeCustomizer)(baseConfig, {
  output: {
    path: path.resolve(rootPath, 'manifest')
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      EXTENSION_CONFIG: {
        appMode: APP_MODE.EXTENSION
      }
    })
  ]
})

module.exports = config
