const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const webpack = require('webpack')
const path = require('path')

const config = webpackMerge(baseConfig, {
  output: {
    path: path.resolve(baseConfig.rootPath, 'build')
  },
  plugins: [
    // Replace browser api with mock api
    new webpack.NormalModuleReplacementPlugin(/(browser-api)$/, result => (result.request = result.request.replace(/(browser-api)$/, '$1-mock')))
  ]
})

module.exports = config
