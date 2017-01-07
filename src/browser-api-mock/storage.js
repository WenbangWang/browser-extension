'use strict'

class StorageArea {
  constructor () {
    this._data = {}
  }

  set (pair, callback) {
    Object.keys(pair).forEach(key => (this._data[key] = pair[key]))
    return callback || callback()
  }

  get (key, callback) {
    if (callback) {
      return callback(this._data[key])
    }

    return this._data[key]
  }
}

const self = module.exports

self.sync = new StorageArea()
self.local = new StorageArea()
