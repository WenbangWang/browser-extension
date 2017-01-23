'use strict'

const browser = require('../../browser-api')

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

module.exports = wrapAsyncFunction
