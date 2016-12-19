const devExtensionConfig = require('./webpack.config.dev.extension')

const entry = {
  background: './src/background.js',
  'content-script': './src/content-script.js'
}

const config = {
  entry,
  output: devExtensionConfig.output,
  resolve: devExtensionConfig.resolve
}

module.exports = config
