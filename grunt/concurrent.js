'use strict'

module.exports = {
  options: {
    logConcurrentOutput: true
  },

  'dev-app': [
    'eslint:app',
    'webpack-dev-server',
    'nodemon:stub'
  ]
}
