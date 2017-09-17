'use strict'

const webpackMerge = require('webpack-merge')
const extensionDevConfig = require('./webpack.config.dev.extension')
const baseProdConfig = require('./webpack.config.base.prod')
const {webpackMergeCustomizer} = require('./helper')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const config = webpackMerge(webpackMergeCustomizer)(extensionDevConfig, baseProdConfig, {
  plugins: [
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: {
        discardComments: {
          removeAll: true
        }
      }
    })
  ]
})

module.exports = config
