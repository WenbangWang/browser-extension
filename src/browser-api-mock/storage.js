import axios from 'axios'

class StorageArea {
  /* istanbul ignore next */
  constructor () {
    this._data = {}
  }

  /* istanbul ignore next */
  set (pair, callback) {
    axios.post('/storage', pair)
      .then(() => {
        callback && callback()
      })
  }

  /* istanbul ignore next */
  get (keys, callback) {
    let query = ''

    if (keys instanceof Array) {
      query = keys.map(key => `key=${key}`).join('&')
    } else if (typeof keys === 'string') {
      query = `key=${keys}`
    }

    axios.get(`/storage${query ? `?${query}` : ''}`)
      .then(response => {
        callback && callback(response.data)
      })
  }
}

const sync = new StorageArea()
const local = new StorageArea()

export {sync, local}
