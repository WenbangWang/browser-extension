'use strict'

module.exports = {
  default: {
    options: {
      timeout: 30000,
      reporter: 'spec',
      quiet: false
    },
    src: ['test/**/*.spec.js']
  }
}
