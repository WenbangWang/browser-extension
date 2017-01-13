const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const rootPath = baseConfig.rootPath

const config = webpackMerge({
  customizeArray (a, b, key) {
    if (key === 'plugins') {
      return a.filter(plugin => (plugin.constructor && plugin.constructor.name) !== 'DefinePlugin').concat(b)
    }
  }
})(baseConfig, {
  output: {
    path: path.resolve(rootPath, 'manifest')
  },
  plugins: [
    new webpack.DefinePlugin({
      OVERRIDE_BASE_URL: JSON.stringify('https://localhost:9090')
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(rootPath, 'src/app/template.html'),
      filename: 'index.html'
    })
  ]
})

console.log(config.plugins)

module.exports = config
