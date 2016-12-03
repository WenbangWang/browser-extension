'use strict';

const appModule = require('../app')
const angular = require('angular')
console.log(1234)

angular.bootstrap(document, [appModule.name]);
