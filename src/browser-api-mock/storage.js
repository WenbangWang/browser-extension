'use strict'

class Sync {
  constructor () {
    this._data = {}
  }

  set (pair) {
    Object.keys(pair).forEach(key => (this._data[key] = pair[key]))
  }

  get (key) {
    return this._data[key]
  }
}

const self = module.exports

self.sync = new Sync()
