'use strict'

module.exports = {
  stub: {
    script: 'stub/server.js',
    options: {
      ext: 'js, json, html',
      ignore: ['!stub/**'],
      watch: ['stub', 'grunt/nodemon.js'],
      args: [
        '9000'
      ]
    }
  }
}
