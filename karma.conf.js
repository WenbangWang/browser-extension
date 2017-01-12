'use strict'

// const entry = 'test/test.main.js'
const webpack = require('webpack')

module.exports = function (config) {
  config.set({
    // base path used to resolve all patterns
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'sinon-chai'],

    client: {
      mocha: {
        timeout: 60000 // 10 seconds - upped from 2 seconds
      },
      chai: {
        includeStack: true
      }
    },

    // list of files/patterns to load in the browser
    files: [
      './node_modules/angular/angular.js',
      './node_modules/angular-mocks/angular-mocks.js',
      {
        pattern: './test/test.main.js',
        watched: false,
        served: true
      }
    ],

    // files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './test/test.main.js': ['webpack', 'sourcemap']
    },

    webpack: {
      devtool: '#inline-source-map',
      module: {
        loaders: [
          {
            test: /\.html/,
            loader: 'html-loader'
          },
          {
            test: /\.less/,
            loader: 'style-loader!css-loader!less-loader'
          },
          {
            test: /\.js/,
            exclude: [/node_modules/],
            loader: 'babel-loader',
            query: {
              presets: ['es2015'],
              cacheDirectory: true,
              plugins: ['istanbul']
            }
          }
        ]
      },
      plugins: [
        new webpack.NormalModuleReplacementPlugin(/(browser-api)$/, result => (result.request = result.request.replace(/(browser-api)$/, '$1-mock')))
      ]
    },

    webpackServer: {
      noInfo: true // prevent console spamming when running in Karma!
    },

    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // Specifies the Format in which report should be generated
    coverageReporter: {
      check: {
        global: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
          excludes: ['src/browser-api-mock/**/*.js']
        }
      },
      reporters: [
        {type: 'html', dir: 'coverage/'},
        {type: 'text-summary'},
        {type: 'text'}
      ]
    },

    // web server port
    port: 9876,

    // enable colors in the output
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // toggle whether to watch files and rerun tests upon incurring changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    // If don't want to open a new browser, change this to "PhantomJS"
    // If want a better stack trace, change this to "Chrome"
    browsers: ['Chrome'],

    // if true, Karma runs tests once and exits
    singleRun: true
  })
}
