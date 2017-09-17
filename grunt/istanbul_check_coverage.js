'use strict'

module.exports = (grunt, options) => {
  return {
    default: {
      options: {
        coverageFolder: '<%= coverage.path %>*', // will check both coverage folders and merge the coverage results
        check: options.coverage.check
      }
    }
  }
}
