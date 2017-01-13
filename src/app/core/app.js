'use strict'

const angular = require('angular')
const todo = require('../todo/module')
const angularTranslate = require('angular-translate')
const browser = require('../browser')
const LogStorageService = require('./service/LogStorageService')

const i18nConfig = require('./config/i18n')
const logConfig = require('./config/log')
const overrideConfig = require('./config/override')

const run = require('./run-block')

const LOG_FLUSHER_CONFIG = require('./constant/LOG_FLUSHER_CONFIG')
const BASE_URL = require('./constant/BASE_URL')
const LOG_STORAGE_CONFIG = require('./constant/LOG_STORAGE_CONFIG')

module.exports =
  angular
    .module('app', [todo, angularTranslate, browser])
    .constant('LOG_FLUSHER_CONFIG', LOG_FLUSHER_CONFIG)
    .constant('BASE_URL', BASE_URL)
    .constant('LOG_STORAGE_CONFIG', LOG_STORAGE_CONFIG)
    .service('logStorageService', LogStorageService)
    .config(i18nConfig)
    .config(logConfig)
    .config(overrideConfig)
    .run(run)
    .name
