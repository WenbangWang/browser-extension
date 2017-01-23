'use strict'

const browser = require('../../browser-api')

class LocalStorageService {
  /* @ngInject */
  constructor ($q, wrapAsyncFunction) {
    this.get = wrapAsyncFunction(browser.storage.local.get, browser.storage.local, $q)
    this.set = wrapAsyncFunction(browser.storage.local.set, browser.storage.local, $q)
  }
}

module.exports = LocalStorageService
