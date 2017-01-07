'use strict'

module.exports = () => {
  return {
    test: [
      'eslint:test',
      'karma:unit'
    ],
    'test:coverage': [
      'eslint:test',
      'clean:coverage',
      'karma:coverage'
    ]
  }
}
