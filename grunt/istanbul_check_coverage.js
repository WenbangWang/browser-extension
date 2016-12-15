'use strict'

module.exports = {
  default: {
    options: {
      coverageFolder: 'coverage*', // will check both coverage folders and merge the coverage results
      check: {
        lines: 80,
        statements: 80
      }
    }
  }
}
