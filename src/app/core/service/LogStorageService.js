'use strict'

class LogStorageService {
  /* @ngInject */
  constructor (localStorageService, $q, $http, BASE_URL, LOG_STORAGE_CONFIG) {
    this._storage = []
    this._isFlushing = false
    this._localStorageService = localStorageService
    this._CONFIG = LOG_STORAGE_CONFIG
    this._BASE_URL = BASE_URL
    this._$q = $q
    this._$http = $http
  }

  /**
   * The method will return storage source from local storage if it is not flushing, otherwise, return in-memory storage instead.
   *
   * @returns {Promise.<Array>} A promise which will <b>always be resolved</b> with an array.
   */
  getStorageSource () {
    if (!this.isFlushing()) {
      return this.getStorageSourceFromLocalStorage()
    }

    return this._$q.resolve(this._storage)
  }

  /**
   * The method will try to get data from local storage by the browser API. If there is no such storage, it will create a new storage with empty array ([])
   *
   * When it failed, it will fallback to resolve with the in-memory storage.
   *
   *
   * @returns {Promise.<Array>} A promise which will <b>always be resolved</b> with an array.
   */
  getStorageSourceFromLocalStorage () {
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

  /**
   * Add {@link LogBody} to the storage source. If it is flushing, add to in-memory storage instead.
   *
   * @param {LogBody} log
   * @returns {Promise} A promise which will <b>always be resolved</b>.
   */
  add (log) {
    return this.getStorageSource()
      .then(source => {
        source.push(log)

        if (!this.isFlushing()) {
          const storage = {}
          storage[this._CONFIG.name] = source

          return this._localStorageService
            .set(storage)
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

  /**
   *
   * @returns {Promise.<Number>} A promise which will <b>always be resolved</b> with the size.
   */
  size () {
    return this.getStorageSource()
      .then(sizeOf)
  }

  /**
   *
   * @returns {Promise.<Boolean>} A promise which will <b>always be resolved</b> with is empty or not.
   */
  isEmpty () {
    return this.size().then(size => size === 0)
  }

  /**
   *
   * @returns {Boolean}
   */
  isFlushing () {
    return this._isFlushing
  }

  /**
   * Clear both the in-memory storage and the local storage.
   *
   * @returns {Promise} A promise which will be resolved when clear succeeded and rejected when failed.
   */
  clear () {
    this._storage = []
    const storage = {}
    storage[this._CONFIG.name] = []
    return this._localStorageService.set(storage)
  }

  /**
   * It will flush the local storage to a service by posting data from local storage. It won't flush again if the last flushing does not finish yet.
   *
   * On flush succeed, whatever in-memory storage has will be copied to local storage and the in-memory storage will be wiped out.
   *
   * There are couple scenarios which flush will be rejected:
   * 1. After a couple times of retry (depends on the config) posting, it still not able to persist the logs.
   * 2. Retry does not meet the retry limit but the size of logs  (depends on the config) are too large. This case shouldn't even happen. It only exists in theory just in case the memory got blow up.
   * 3. The copy from in-memory storage to local storage failed.
   *
   * All scenarios above would reject the promise and the client of this service should take of it. Normally, using {@link LogStorageService#clear} should be sufficient.
   *
   * @returns {Promise} A promise which will be resolved when flush succeeded and rejected when failed.
   */
  flush () {
    if (!this.isFlushing()) {
      this._isFlushing = true
      const deferred = this._$q.defer()
      const that = this
      let count = 0
      const postLog = function postLog () {
        return that.getStorageSourceFromLocalStorage()
          .then(source => {
            that._$http.post(`${that._BASE_URL}/log`, source)
              .then(deferred.resolve)
              // Retry posting when it failed.
              .catch(err => {
                if (++count < that._CONFIG.retry && sizeOf(source) <= that._CONFIG.threshold) {
                  return postLog()
                }

                return deferred.reject(new Error(err))
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

/**
 * @typedef {Object} LogBody
 *
 * @property {Number} timestamp
 * @property {String} type - Log type.
 * @property {Array} message - Log messages.
 * @property {String} [context] - The context where log is logger.
 * @property {Array<StackFrame>} [stacktrace] - Stacktrace frame from presented error.
 */
