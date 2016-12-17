const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin')
const path = require('path')

const entry = {
  background: './src/background.js',
  'content-script': './src/content-script.js'
}
const config = webpackMerge(baseConfig, {
  entry,
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(baseConfig.rootPath, 'src/app/template.html'),
      filename: 'index.html',
      // exclude extension script from app html
      excludeAssets: Object.keys(entry).map(key => new RegExp(`${key}\.js`))
    }),
    new HtmlWebpackExcludeAssetsPlugin()
  ]
})

module.exports = config
