'use strict'

module.exports = {
  options: {
    logConcurrentOutput: true
  },

  'dev-app': [
    'webpack-dev-server',
    'nodemon:stub'
  ]
}
