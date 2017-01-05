'use strict'

const angular = require('angular')
const todo = require('../todo/module')
const angularTranslate = require('angular-translate')
const i18nConfig = require('./config/i18n')

module.exports =
  angular
    .module('app', [todo.name, angularTranslate])
    .config(i18nConfig)
