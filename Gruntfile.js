'use strict'

module.exports = grunt => {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt)

  // Load each task from its own file
  require('load-grunt-config')(grunt, {
    config: {
      src: {
        path: 'src'
      },
      app: {
        path: '<%= src.path %>/app'
      },
      test: {
        path: 'test',
        filePattern: '<%= test.path %>/**/*.js'
      },
      coverage: {
        path: 'coverage'
      },
      stub: {
        path: 'stub',
        port: '9000'
      }
    }
  })
}
