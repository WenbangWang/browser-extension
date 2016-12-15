'use strict'

module.exports = () => {
  return {
    test: [
      'eslint:test',
      'mocha_istanbul'
    ],
    'test:coverage': [
      'test',
      'istanbul_check_coverage'
    ]
  }
}
