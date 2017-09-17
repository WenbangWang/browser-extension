'use strict'

module.exports = () => {
  return {
    dev: 'dev:app',

    'dev:app': [
      'env:dev',
      'concurrent:dev-app'
    ],

    'dev:extension': [
      'clean:manifest',
      'env:dev',
      'webpack:extension',
      'webpack:script',
      'manifest:dev',
      'nodemon:stub-https'
    ]
  }
}
