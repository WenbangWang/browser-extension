import axios from 'axios'

class StorageArea {
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
    let defaultValues

    if (keys instanceof Array) {
      query = keys.map(key => `key=${key}`).join('&')
    } else if (typeof keys === 'string') {
      query = `key=${keys}`
    } else if (typeof keys === 'object') {
      query = Object.keys(keys).map(key => `key=${key}`).join('&')
      defaultValues = keys
    }

    axios.get(`/storage${query ? `?${query}` : ''}`)
      .then(response => {
        if (defaultValues) {
          const data = Object.keys(keys).reduce((data, key) => {
            data[key] = response.data[key] || defaultValues[key]
            return data
          }, {})
          return callback(data)
        }

        return callback(response.data)
      })
  }
}

const sync = new StorageArea()
const local = new StorageArea()

export {sync, local}
