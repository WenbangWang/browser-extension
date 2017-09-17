'use strict'

const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const bootstrapExtractTextPlugin = new ExtractTextPlugin('bootstrap.css')
const appExtractTextPlugin = new ExtractTextPlugin('styles.css')
const helper = require('./helper')
const rootPath = helper.rootPath

const config = {
  entry: {
    app: ['./src/app/bootstrap.js'],
    vendor: ['vue', 'vuex', 'vue-i18n', 'vue-router', 'vuex-router-sync', 'bootstrap-vue', 'lodash.merge']
  },
  output: {
    filename: '[name].js'
  },
  resolve: {
    alias: {
      vuex$: 'vuex/dist/vuex.esm.js',
      vue$: 'vue/dist/vue.esm.js',
      'vue-i18n$': 'vue-i18n/dist/vue-i18n.esm.js',
      'bootstrap-vue$': 'bootstrap-vue/dist/bootstrap-vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          extractCSS: true
        }
      },
      {
        test: /bootstrap(.*)\/(.*)\.css$/,
        loader: bootstrapExtractTextPlugin.extract('css-loader?sourceMap')
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url-loader',
        options: {
          prefix: 'font/',
          limit: 5000
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/octet-stream'
        }
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'image/svg+xml'
        }
      },
      {
        // TODO hook editing to browser see https://github.com/webpack/css-loader and https://medium.com/@toolmantim/getting-started-with-css-sourcemaps-and-in-browser-sass-editing-b4daab987fb0#.1tmdpau2c
        test: /\.scss/,
        exclude: /node_modules/,
        loader: appExtractTextPlugin.extract(
          ['css-loader?sourceMap', 'sass-loader?sourceMap']
        )
      },
      {
        test: /\.properties$/,
        exclude: /node_modules/,
        use: [
          'json-loader',
          'enhanced-properties-loader'
        ]
      },
      // Add babel for better debugging with source map.
      {
        test: /\.js/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
        options: {
          cacheDirectory: true
        }
      }
    ]
  },
  plugins: [
    bootstrapExtractTextPlugin,
    appExtractTextPlugin,
    // checkout webpack-md5-hash plugin
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js'
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(rootPath, 'src/app/template.html'),
      filename: 'index.html',
      alwaysWriteToDisk: true
    }),
    new webpack.EnvironmentPlugin({
      CONFIG_OVERRIDE_KEY: '__epnExtensionConfig',
      EXTENSION_CONFIG: {
        locale: {
          default: 'en',
          others: [
            'de-DE'
          ]
        }
      }
    })
  ]
}

module.exports = config
