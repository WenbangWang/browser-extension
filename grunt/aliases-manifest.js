'use strict'

const Policy = require('csp-parse')
const manifestTemplate = require('../manifest.json')
const jsonfile = require('jsonfile')
const path = require('path')
const manifestPath = path.join(__dirname, '../manifest/manifest.json')

module.exports = (grunt, options) => {
  return {
    'manifest:dev' () {
      const manifest = copy(manifestTemplate)
      const policy = new Policy(manifest.content_security_policy)
      // change content security policy - default-src to localhost.
      policy.add('default-src', `https://localhost:${options.stub.port} https://localhost:${options.webpack.devServer.port}`)

      manifest.content_security_policy = policy.toString()
      grunt.log.ok(`Manifest created at ${manifestPath}`)
      jsonfile.writeFileSync(manifestPath, manifest, {spaces: 2})
    },
    'manifest:prod' () {
      jsonfile.writeFileSync(manifestPath, manifestTemplate, {spaces: 2})
    }
  }
}

function copy (json) {
  return JSON.parse(JSON.stringify(json))
}
