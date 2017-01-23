'use strict'

const angular = require('angular')

const wrapAsyncFunction = require('./wrapAsyncFunction')

const LocalStorageService = require('./LocalStorageService')
const ShellService = require('./ShellService')

module.exports = angular.module('browser', [])
  .constant('wrapAsyncFunction', wrapAsyncFunction)
  .service('localStorageService', LocalStorageService)
  .service('shellService', ShellService)
  .name
