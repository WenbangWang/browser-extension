'use strict'
/* global OVERRIDE_BASE_URL */

/* @ngInject */
function overrideConfig (BASE_URL, LOG_STORAGE_CONFIG, LOG_FLUSHER_CONFIG, $windowProvider, $provide) {
  const $window = $windowProvider.$get()

  const extensionConfig = $window._extensionConfig || {}

  const NEW_BASE_URL = extensionConfig.BASE_URL || OVERRIDE_BASE_URL

  NEW_BASE_URL && $provide.constant('BASE_URL', NEW_BASE_URL)
  extensionConfig.LOG_STORAGE_CONFIG && $provide.constant('LOG_STORAGE_CONFIG', Object.assign({}, LOG_STORAGE_CONFIG, extensionConfig.LOG_STORAGE_CONFIG))
  extensionConfig.LOG_FLUSHER_CONFIG && $provide.constant('LOG_FLUSHER_CONFIG', Object.assign({}, LOG_FLUSHER_CONFIG, extensionConfig.LOG_FLUSHER_CONFIG))
}

module.exports = overrideConfig
