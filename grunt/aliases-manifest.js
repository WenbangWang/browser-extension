'use strict'

const Policy = require('csp-parse')
const manifestTemplate = require('../manifest.json')
const jsonfile = require('jsonfile')
const path = require('path')
const fs = require('fs')
const properties = require('properties')
const mkdirp = require('mkdirp')
const localePath = path.resolve(__dirname, '../locales')

module.exports = (grunt, options) => {
  const manifestPath = path.join(__dirname, `../${options.manifest.path}/manifest.json`)

  return {
    'manifest:dev' () {
      const manifest = copy(manifestTemplate)
      const policy = new Policy(manifest.content_security_policy)
      // change content security policy - default-src to localhost.
      policy.add('default-src', `https://localhost:${options.stub.port} https://localhost:${options.webpack.devServer.port}`)

      manifest.content_security_policy = policy.toString()
      grunt.log.ok(`Manifest created at ${manifestPath}`)
      jsonfile.writeFileSync(manifestPath, manifest, {spaces: 2})

      parseAndCopyLocales(grunt, options)
    },
    'manifest:prod' () {
      jsonfile.writeFileSync(manifestPath, manifestTemplate, {spaces: 2})

      parseAndCopyLocales(grunt, options)
    }
  }
}

function copy (json) {
  return JSON.parse(JSON.stringify(json))
}

function parseAndCopyLocales (grunt, options) {
  findManifestLocaleDirectoryPaths(localePath)
    .map(path => ({
      content: loadAndParseLocaleFilesToJSON(`${path}/index.properties`),
      localeIdentifier: directoryPathToLocaleIdentifier(path)
    }))
    .forEach(write)

  function findManifestLocaleDirectoryPaths (dirname) {
    const files = fs.readdirSync(dirname)

    const directoryPaths = files
      .map(file => ({filePath: `${dirname}/${file}`, file}))
      .filter(({filePath}) => fs.statSync(filePath).isDirectory())

    return directoryPaths
      .filter(({file}) => file === 'manifest')
      .map(({filePath}) => filePath)
      .concat(
        directoryPaths
          .filter(({file}) => file !== 'manifest')
          .reduce((paths, {filePath}) => paths.concat(findManifestLocaleDirectoryPaths(filePath)), [])
      )
  }

  function directoryPathToLocaleIdentifier (path) {
    return path.substring(localePath.length + 1).match(/(.*)\/manifest$/)[1].split('/').reverse().join('_')
  }

  function loadAndParseLocaleFilesToJSON (filePath) {
    return properties.parse(fs.readFileSync(filePath, 'utf8'), {namespaces: true})
  }

  function write ({content, localeIdentifier}) {
    const dir = path.resolve(__dirname, `../${options.manifest.path}/_locales/${localeIdentifier}`)
    mkdirp.sync(dir)
    jsonfile.writeFileSync(path.resolve(dir, `messages.json`), content, {spaces: 2})
    grunt.log.ok(`Locale "${localeIdentifier}" created at ${dir}`)
  }
}
