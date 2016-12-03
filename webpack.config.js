const webpack = require('webpack')
const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const config = {
  entry: {
    app: ['./src/core/bootstrap.js'],
    vendor: ['angular', 'bootstrap/dist/js/bootstrap', 'jquery']
  },
  output: {
    path: path.resolve(__dirname, 'build'),
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
        loader: ExtractTextPlugin.extract('css-loader?sourceMap')
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
        loader: ExtractTextPlugin.extract(
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
    new ExtractTextPlugin('styles.css'),
    // checkout webpack-md5-hash plugin
    new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    })
  ],
  devtool: 'inline-source-map'
};

module.exports = config;
