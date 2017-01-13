'use strict'

const cloneDeep = require('lodash').cloneDeep

module.exports = () => {
  const stub = {
    script: '<%= stub.path %>/server.js',
    options: {
      ext: 'js, json, html',
      ignore: ['!<%= stub.path %>/**'],
      watch: ['<%= stub.path %>', 'grunt/nodemon.js'],
      args: [
        '<%= stub.port %>'
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
