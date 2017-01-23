'use strict'

const browser = require('../../browser-api')
const MessagingCommandEnum = require('../../lib/MessagingCommandEnum')

class ShellService {
  /* @ngInject */
  constructor ($q, wrapAsyncFunction) {
    this._sendMessage = wrapAsyncFunction(browser.runtime.sendMessage, browser.runtime, $q)
  }

  getEBayItems () {
    return this._sendMessage({command: MessagingCommandEnum.GET_EBAY_ITEMS})
  }
}

module.exports = ShellService
