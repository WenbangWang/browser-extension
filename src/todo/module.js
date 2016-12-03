'use strict'

const component = require('./component')
const todoService = require('./service')
require('./style.scss')

module.exports = angular.module('todo', [])
  .component('todoComponent', component)
  .service('todoService', todoService)
