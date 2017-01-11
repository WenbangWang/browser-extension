'use strict'

const angular = require('angular')
const todo = require('../todo/module')
const angularTranslate = require('angular-translate')
const browser = require('../browser')
const LogStorageService = require('./service/LogStorageService')
const i18nConfig = require('./config/i18n')
const logConfig = require('./config/log')

module.exports =
  angular
    .module('app', [todo, angularTranslate, browser])
    .service('logStorageService', LogStorageService)
    .config(i18nConfig)
    .config(logConfig)
    .name
