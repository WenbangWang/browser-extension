const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const bootstrapExtractTextPlugin = new ExtractTextPlugin('bootstrap.css')
const appExtractTextPlugin = new ExtractTextPlugin('styles.css')
const rootPath = path.resolve(__dirname, '..')
const outputPath = path.resolve(rootPath, 'build')

const config = {
  entry: {
    app: './src/app/core/bootstrap.js',
    vendor: ['angular', 'bootstrap/dist/js/bootstrap', 'jquery']
  },
  output: {
    path: outputPath,
    filename: '[name].js'
  },
  resolve: {
    root: __dirname + '/src/'
  },
  module: {
    noParse: [],
    loaders: [
      {
        test: /bootstrap\/(.*)\.css$/,
        loader: bootstrapExtractTextPlugin.extract('css-loader?sourceMap')
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file'
      },
      {
        test: /\.(woff|woff2)$/,
        loader: 'url',
        query: {
          prefix: 'font/',
          limit: 5000
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          mimetype: 'application/octet-stream'
        }
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url',
        query: {
          limit: 10000,
          mimetype: 'image/svg+xml'
        }
      },
      {
        // TODO hook editing to browser see https://github.com/webpack/css-loader and https://medium.com/@toolmantim/getting-started-with-css-sourcemaps-and-in-browser-sass-editing-b4daab987fb0#.1tmdpau2c
        test: /\.scss/,
        exclude: /node_modules/,
        loader: appExtractTextPlugin.extract(
          'css-loader?sourceMap!sass-loader?sourceMap'
        )
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'ng-annotate'
      },
      {
        test: /\.html$/,
        loader: 'raw'
      }
    ]
  },
  plugins: [
    bootstrapExtractTextPlugin,
    appExtractTextPlugin,
    // checkout webpack-md5-hash plugin
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  devtool: '#inline-source-map'

}

module.exports = config
module.exports.rootPath = rootPath
