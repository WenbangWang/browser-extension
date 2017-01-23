const devExtensionConfig = require('./webpack.config.dev.extension')

const entry = {
  'background-script': ['./src/background-script/index.js'],
  'content-script': ['./src/content-script/index.js']
}

const config = {
  entry,
  output: devExtensionConfig.output,
  resolve: devExtensionConfig.resolve,
  devtool: '#source-map'
}

module.exports = config
