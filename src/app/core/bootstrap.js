'use strict'

const app = require('./app')
const angular = require('angular')
require('jquery')
require('bootstrap/dist/js/bootstrap')
require('bootstrap/dist/css/bootstrap.css')

angular.bootstrap(document, [app])
