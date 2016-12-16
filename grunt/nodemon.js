'use strict'

module.exports = {
  stub: {
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
}
