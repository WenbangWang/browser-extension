'use strict'

const extend = require('lodash/extend')

module.exports = grunt => {
  const aliases = {}

  extend(aliases, require('./aliases-lint')(grunt))
  extend(aliases, require('./aliases-dev')(grunt))
  extend(aliases, require('./aliases-test')(grunt))
  extend(aliases, require('./aliases-manifest')(grunt))

  return aliases
}
