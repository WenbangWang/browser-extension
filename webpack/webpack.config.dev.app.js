const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const webpack = require('webpack')

const config = webpackMerge(baseConfig, {
  plugins: [
    // Replace browser api with mock api
    new webpack.NormalModuleReplacementPlugin(/(browser-api)$/, result => (result.request = result.request.replace(/(browser-api)$/, '$1-mock')))
  ]
})

module.exports = config
