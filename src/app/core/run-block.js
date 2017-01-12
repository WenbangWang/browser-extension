'use strict'

/* @ngInject */
function run (logStorageService, $interval) {

}

function logFlusher (logStorageService, $q) {
  return function flush () {
    if (logStorageService.isFlushing()) {
      return
    }

    logStorageService.isEmpty()
      .then(isEmpty => {
        if (isEmpty) {
          return $q.resolve()
        }

        // return logStorageService.flush()
      })
  }
}

const self = module.exports = run
self.logFlusher = logFlusher

