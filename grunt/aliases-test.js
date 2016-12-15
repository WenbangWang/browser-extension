'use strict'

module.exports = () => {
  return {
    test: [
      'mocha_istanbul'
    ],
    'test:coverage': [
      'mocha_istanbul',
      'istanbul_check_coverage'
    ]
  }
}
