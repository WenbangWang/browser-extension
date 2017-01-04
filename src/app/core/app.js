'use strict'

const angular = require('angular')
const todo = require('../todo/module')

module.exports = angular.module('app', [todo.name])
