'use strict'

const extend = require('lodash/extend')

module.exports = (grunt, options) => {
  const aliases = {}

  extend(aliases, require('./aliases-lint')(grunt))
  extend(aliases, require('./aliases-dev')(grunt))
  extend(aliases, require('./aliases-test')(grunt))
  extend(aliases, require('./aliases-manifest')(grunt, options))

  return aliases
}
