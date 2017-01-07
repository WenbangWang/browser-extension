'use strict'

const browser = require('../../browser-api')

class LocalStorageService {
  /* @ngInject */
  constructor ($q) {
    this.get = wrapAsyncFunction(browser.storage.local.get, browser.storage.local, $q)
    this.set = wrapAsyncFunction(browser.storage.local.set, browser.storage.local, $q)
  }
}

module.exports = LocalStorageService

function wrapAsyncFunction (func, context, promise) {
  return function asyncFunctionWrapper () {
    const args = [].slice.call(arguments)

    return promise((resolve, reject) => {
      func.apply(context, args.concat(makeCallback(resolve, reject)))
    })
  }
}

function makeCallback (resolve, reject) {
  return function callbackPromise () {
    if (browser.runtime.lastError) {
      reject(browser.runtime.lastError)
    } else {
      resolve.apply(null, arguments)
    }
  }
}
