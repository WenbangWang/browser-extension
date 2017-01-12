'use strict'

const Promise = require('bluebird')
const extend = require('lodash').extend

// Copied from angular-bluebird-promises.
// The reason behind this is to take advantage of auto-resolve/reject promise in mocha by just returning the promise.
// If use $q from angular directly, you have to use "done" as well as $scope.$apply/$digest() to trigger the scheduler.
module.exports = function polyfill () {
  function $qBluebird (resolve, reject) {
    return new Promise(resolve, reject)
  }

  $qBluebird.prototype = Promise.prototype

  extend($qBluebird, Promise)

  $qBluebird.defer = () => {
    const deferred = {}
    deferred.promise = $qBluebird((resolve, reject) => {
      deferred.resolve = resolve
      deferred.reject = reject
    })
    deferred.promise.progressCallbacks = []
    deferred.notify = function (progressValue) {
      deferred.promise.progressCallbacks.forEach(cb => typeof cb === 'function' && cb(progressValue))
    }
    return deferred
  }

  $qBluebird.reject = $qBluebird.rejected
  $qBluebird.when = $qBluebird.cast

  const originalAll = $qBluebird.all
  $qBluebird.all = function (promises) {

    if (typeof promises === 'object' && !Array.isArray(promises)) {
      return $qBluebird.props(promises)
    } else {
      return originalAll(promises)
    }

  }

  const originalThen = $qBluebird.prototype.then
  $qBluebird.prototype.then = function (fulfilledHandler, rejectedHandler, progressHandler) {
    if (this.progressCallbacks) {
      this.progressCallbacks.push(progressHandler)
    }
    return originalThen.call(this, fulfilledHandler, rejectedHandler, progressHandler)
  }

  const originalFinally = $qBluebird.prototype.finally
  $qBluebird.prototype.finally = function (finallyHandler, progressHandler) {
    if (this.progressCallbacks) {
      this.progressCallbacks.push(progressHandler)
    }
    return originalFinally.call(this, finallyHandler)
  }

  $qBluebird.onPossiblyUnhandledRejection(() => {})

  return $qBluebird
}
