'use strict'

const webpack = require('webpack')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

const config = {
  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.min.js'
    }
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
      EXTENSION_CONFIG: {
        logLevel: 'error'
      }
    }),
    new UglifyJSPlugin({
      parallel: true,
      uglifyOptions: {
        compress: {
          sequences: true,
          dead_code: true,
          conditionals: true,
          booleans: true,
          unused: true,
          if_return: true,
          join_vars: true,
          drop_console: true
        }
      }
    })
  ],
  devtool: false
}

module.exports = config
