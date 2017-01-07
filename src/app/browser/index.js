'use strict'

const angular = require('angular')
const LocalStorageService = require('./LocalStorageService')

module.exports = angular.module('browser', [])
  .service('localStorageService', LocalStorageService)
  .name

