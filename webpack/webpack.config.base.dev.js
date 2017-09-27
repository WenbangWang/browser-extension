'use strict'

const webpack = require('webpack')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const {webpackMergeCustomizer} = require('./helper')

const config = webpackMerge(webpackMergeCustomizer)(baseConfig, {
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
      EXTENSION_CONFIG: {
        logLevel: 'debug'
      }
    })
  ],
  devtool: '#source-map'
})

module.exports = config
