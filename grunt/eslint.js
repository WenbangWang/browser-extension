'use strict'

module.exports = {
  gruntfile: [
    'Gruntfile.js',
    'grunt/*.js'
  ],

  app: {
    options: {
      configFile: '<%= app.path %>/.eslintrc'
    },
    src: ['<%= app.path %>/**/*.js']
  },
  test: {
    options: {
      configFile: '<%= test.path %>/.eslintrc'
    },
    src: ['<%= test.path %>/**/*.spec.js']
  }
}
