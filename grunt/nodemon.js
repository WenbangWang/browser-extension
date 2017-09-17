'use strict'

const cloneDeep = require('lodash.clonedeep')

module.exports = (grunt, options) => {
  const stub = {
    script: '<%= stub.path %>/server.js',
    options: {
      ext: 'js, json, html',
      ignore: ['!<%= stub.path %>/**'],
      watch: ['<%= stub.path %>', 'grunt/nodemon.js'],
      args: [
        `${options.stub.port}`
      ]
    }
  }
  const stubHttps = cloneDeep(stub)
  stubHttps.options.args.push('true')

  return {
    stub,
    'stub-https': stubHttps
  }
}
