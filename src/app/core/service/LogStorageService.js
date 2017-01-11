'use strict'

const LOG_STORAGE_CONFIG = {
  name: 'log',
  batchSize: 64,
  threshold: 5120,
  retry: 3
}
const BASE_URL = 'http://localhost:9090'

class LogStorageService {
  /* @ngInject */
  constructor (localStorageService, $q, $http) {
    this._storage = []
    this._isFlushing = false
    this._localStorageService = localStorageService
    this._CONFIG = LOG_STORAGE_CONFIG
    this._BASE_URL = BASE_URL
    this._$q = $q
    this._$http = $http
  }

  getStorageSource () {
    if (!this.isFlushing()) {
      return this._localStorageService.get(this._CONFIG.name)
        .then(data => data && data[this._CONFIG.name])
        // Fallback to in-memory storage when failed.
        .catch(() => this._storage)
        .then(source => {
          if (source instanceof Array) {
            return this._$q.resolve(source)
          }

          const deferred = this._$q.defer()
          const storage = {}
          storage[this._CONFIG.name] = []
          this._localStorageService.set(storage)
            .then(() => {
              deferred.resolve(storage[this._CONFIG.name])
            })
            // Fallback to in-memory storage when failed.
            .catch(() => {
              deferred.resolve(this._storage)
            })

          return deferred.promise
        })
    }

    return this._$q.resolve(this._storage)
  }

  add (log) {
    return this.getStorageSource()
      .then(source => {
        source.push(log)

        if (!this.isFlushing()) {
          const storage = {}
          storage[this._CONFIG.name] = source

          return this._localStorageService.set(storage)
          // Fallback to in-memory storage when failed.
            .catch(() => {
              // Only persist when the storage source is not in-memory storage.
              // Since the log already pushed when getStorageSource is resolves at first place.
              if (source !== this._storage) {
                this._storage.push(log)
              }

              // Otherwise, just resolve since it is already added at beginning.
              return this._$q.resolve()
            })
        }

        return this._$q.resolve()
      })
  }

  size () {
    return this.getStorageSource()
      .then(sizeOf)
  }

  isEmpty () {
    return this.size().then(size => size === 0)
  }

  isFlushing () {
    return this._isFlushing
  }

  clear () {
    this._storage = []
    const storage = {}
    storage[this._CONFIG.name] = []
    return this._localStorageService.set(storage)
  }

  flush () {
    if (!this.isFlushing()) {
      this._isFlushing = true
      const deferred = this._$q.defer()
      const that = this
      let count = 0
      const postLog = function postLog () {
        return that.getStorageSource()
          .then(source => {
            that._$http.post(`${that._BASE_URL}/log`, source)
              .then(deferred.resolve)
              // Retry posting when it failed.
              .catch(() => {
                if (++count < that._CONFIG.retry && sizeOf(source) <= that._CONFIG.threshold) {
                  return postLog()
                }

                return deferred.reject()
              })

            return deferred.promise
          })
      }

      return postLog()
        .then(() => {
          // Stop flushing immediately when posting succeeded.
          this._isFlushing = false
          const storage = {}
          storage[this._CONFIG.name] = this._storage
          return this._localStorageService.set(storage)
        })
        // Need to clear the in-memory storage after we copy it over successfully.
        .then(() => (this._storage = []))
        // Stop flushing process if all the promises above failed.
        .finally(() => (this._isFlushing = false))
    }

    return this._$q.resolve()
  }
}

function sizeOf (source) {
  return source ? source.length : 0
}

module.exports = LogStorageService
