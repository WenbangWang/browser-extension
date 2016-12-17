'use strict'

module.exports = () => {
  return {
    dev: [],

    'dev:app': [
      'eslint:app',
      'concurrent:dev-app'
    ],

    'dev:extension': [
      'clean:build',
      'webpack'
    ]
  }
}
