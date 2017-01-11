'use strict'

class StorageArea {
  constructor () {
    this._data = {}
  }

  set (pair, callback) {
    Object.keys(pair).forEach(key => (this._data[key] = pair[key]))
    return callback || callback()
  }

  get (keys, callback) {
    const data = {}

    if (keys instanceof Array) {
      keys.forEach(key => {
        data[key] = this._data[key]
      })
    } else if (keys instanceof String) {
      data[keys] = this._data[keys]
    }

    if (callback) {
      return callback(data)
    }

    return data
  }
}

const self = module.exports

self.sync = new StorageArea()
self.local = new StorageArea()
