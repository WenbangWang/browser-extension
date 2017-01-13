'use strict'

module.exports = () => {
  return {
    dev: [],

    'dev:app': [
      'concurrent:dev-app'
    ],

    'dev:extension': [
      'clean:manifest',
      'webpack:app',
      'webpack:script',
      'manifest:dev',
      'nodemon:stub-https'
    ]
  }
}
