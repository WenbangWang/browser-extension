'use strict'

const path = require('path')
const webpack = require('webpack')
const merge = require('lodash.merge')

const rootPath = path.resolve(__dirname, '..')
const webpackMergeCustomizer = {
  customizeArray (dest, src, key) {
    if (key === 'plugins') {
      return customizedPlugins(dest, src)
    }
  }
}

module.exports = {
  rootPath,
  webpackMergeCustomizer
}

function customizedPlugins (dest, src) {
  const destEnvironmentPlugin = dest.find(isEnvironmentPlugin)
  const srcEnvironmentPlugin = src.find(isEnvironmentPlugin)

  if (destEnvironmentPlugin && srcEnvironmentPlugin) {
    return [
      ...dest.filter(plugin => !isEnvironmentPlugin(plugin)),
      ...src.filter(plugin => !isEnvironmentPlugin(plugin)),
      mergedEnvironmentPlugin(destEnvironmentPlugin, srcEnvironmentPlugin)
    ]
  }
}

function mergedEnvironmentPlugin (destEnvironmentPlugin, srcEnvironmentPlugin) {
  const mergedEnvironmentVariables = isEnvironmentVariableObject(destEnvironmentPlugin) && isEnvironmentVariableObject(srcEnvironmentPlugin) ? merge(destEnvironmentPlugin.defaultValues, srcEnvironmentPlugin.defaultValues) : destEnvironmentPlugin.keys

  return new webpack.EnvironmentPlugin(mergedEnvironmentVariables)
}

function isEnvironmentPlugin (plugin) {
  return plugin instanceof webpack.EnvironmentPlugin
}

function isEnvironmentVariableObject (environmentPlugin) {
  return Object.keys(environmentPlugin.defaultValues).length !== 0
}
