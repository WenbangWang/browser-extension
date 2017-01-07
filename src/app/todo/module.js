'use strict'

const angular = require('angular')
const component = require('./component')
const todoService = require('./service')
const browser = require('../browser')
require('./style.scss')

module.exports = angular.module('todo', [browser])
  .component('todoComponent', component)
  .service('todoService', todoService)
  .name
