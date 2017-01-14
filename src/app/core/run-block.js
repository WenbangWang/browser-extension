'use strict'

const self = module.exports = run
self.logFlusher = logFlusher

/* @ngInject */
function run (logStorageService, $interval, $q, $log, LOG_FLUSHER_CONFIG) {
  $interval(self.logFlusher(logStorageService, $q, $log, LOG_FLUSHER_CONFIG), LOG_FLUSHER_CONFIG.interval)
}

function logFlusher (logStorageService, $q, $log, LOG_FLUSHER_CONFIG) {
  return function flush () {
    if (logStorageService.isFlushing()) {
      return $q.resolve()
    }

    return logStorageService.size()
      .then(size => {
        if (size <= LOG_FLUSHER_CONFIG.batchSize) {
          return $q.resolve()
        }

        return logStorageService.flush()
      })
      // These two catches are last resorts in case of something really wrong happened.
      .catch(error => {
        $log.error(error)
        return logStorageService.clear()
      })
      .catch($log.error)
  }
}
