'use strict'

const angular = require('angular')
const todo = require('./todo/module')
require('jquery')
require('bootstrap/dist/js/bootstrap')
require('bootstrap/dist/css/bootstrap.css')

module.exports = angular.module('app', [todo.name])
