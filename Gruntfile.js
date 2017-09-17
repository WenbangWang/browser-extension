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
        filePattern: '<%= test.path %>/**/!(*.browser).spec.js'
      },
      coverage: {
        path: 'coverage',
        excludes: ['**/browser-api-mock/**/*.js'],
        check: {
          lines: 100,
          statements: 100,
          branches: 100,
          functions: 100
        }
      },
      stub: {
        path: 'stub',
        port: 9090
      },
      manifest: {
        path: 'manifest'
      },
      build: {
        path: 'build'
      },
      webpack: {
        devServer: {
          port: 8080
        }
      }
    }
  })
}
