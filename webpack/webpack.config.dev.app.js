'use strict'

const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base.dev')
const webpack = require('webpack')
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const path = require('path')
const {rootPath, webpackMergeCustomizer} = require('./helper')
const APP_MODE = require('../constants/APP_MODE')

const config = webpackMerge(webpackMergeCustomizer)(baseConfig, {
  output: {
    path: path.resolve(rootPath, 'build')
  },
  plugins: [
    // Replace browser api with mock api
    new webpack.NormalModuleReplacementPlugin(/(browser-api)$/, result => (result.request = result.request.replace(/(browser-api)$/, '$1-mock'))),
    new HtmlWebpackHarddiskPlugin(),
    new webpack.EnvironmentPlugin({
      EXTENSION_CONFIG: {
        appMode: APP_MODE.WEB_APP
      }
    })
  ]
})

module.exports = config
