'use strict'

const webpackMerge = require('webpack-merge')
const scriptDevConfig = require('./webpack.config.dev.script')
const baseProdConfig = require('./webpack.config.base.prod')
const {webpackMergeCustomizer} = require('./helper')

const config = webpackMerge(webpackMergeCustomizer)(scriptDevConfig, baseProdConfig)

module.exports = config
