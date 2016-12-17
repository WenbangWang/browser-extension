const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin')
const path = require('path')
const rootPath = baseConfig.rootPath

const config = webpackMerge(baseConfig, {
  output: {
    path: path.resolve(rootPath, 'manifest')
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(rootPath, 'src/app/template.html'),
      filename: 'index.html'
    })
  ]
})

module.exports = config
