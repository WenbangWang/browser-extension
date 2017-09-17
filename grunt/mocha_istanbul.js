'use strict'

module.exports = (grunt, options) => {
  return {
    default: {
      options: {
        timeout: 30000,
        reporter: 'spec',
        quiet: false,
        excludes: options.coverage.excludes
      },
      src: ['<%= test.filePattern %>']
    }
  }
}
