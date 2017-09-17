'use strict'

require('babel-polyfill')
require('babel-register')({
  presets: [
    'env',
    'stage-2'
  ],
  plugins: [
    'transform-object-rest-spread'
  ]
})
global.chai = require('chai')
global.should = require('chai').should()
global.expect = require('chai').expect
global.AssertionError = require('chai').AssertionError
global.sinon = require('sinon')

global.swallow = function (thrower) {
  try {
    thrower()
  } catch (e) { }
}

const sinonChai = require('sinon-chai')
chai.use(sinonChai)
