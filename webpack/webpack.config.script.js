const baseConfig = require('./webpack.config.base')
const path = require('path')
const rootPath = baseConfig.rootPath

const entry = {
  background: './src/background.js',
  'content-script': './src/content-script.js'
}

const config = {
  entry,
  output: {
    path: path.resolve(rootPath, 'manifest'),
    filename: '[name].js'
  },
  resolve: {
    root: path.resolve(rootPath, '../src')
  }
}

module.exports = config
