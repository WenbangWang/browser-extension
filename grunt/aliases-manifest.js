'use strict'

const Policy = require('csp-parse')
const manifestTemplate = require('../manifest.json')
const jsonfile = require('jsonfile')
const path = require('path')
const manifestPath = path.join(__dirname, '../manifest/manifest.json')

module.exports = grunt => {
  return {
    'manifest:dev': function () {
      const manifest = copy(manifestTemplate)
      const policy = new Policy(manifest.content_security_policy)
      // change content security policy - connect-src to localhost.
      policy.set('connect-src', 'localhost')

      manifest.content_security_policy = policy.toString()
      grunt.log.ok(`Manifest created at ${manifestPath}`)
      jsonfile.writeFileSync(manifestPath, manifest, {spaces: 2})
    }
  }
}

function copy (json) {
  return JSON.parse(JSON.stringify(json))
}
