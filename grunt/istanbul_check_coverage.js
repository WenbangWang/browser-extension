'use strict'

module.exports = {
  default: {
    options: {
      coverageFolder: '<%= coverage.path %>*', // will check both coverage folders and merge the coverage results
      check: {
        lines: 100,
        statements: 100,
        branches: 100,
        functions: 100
      }
    }
  }
}
