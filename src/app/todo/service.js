'use strict'

// const browser = require('../../browser-api')

class TodoService {
  constructor (localStorageService, $log) {
    this.data = []
    this._localStorageService = localStorageService
    this._$log = $log
  }

  findAll (callback) {
    this._localStorageService.get('todo')
      .then(keys => {
        if (keys.todo != null) {
          this.data = keys.todo
          for (var i = 0; i < this.data.length; i++) {
            this.data[i]['id'] = i + 1
          }
          // console.log(this.data)
          callback(this.data)
        }
      })
  }

  sync () {
    this._localStorageService.set({todo: this.data})
    // browser.storage.sync.set({todo: this.data}, function () {
    //   // console.log('Data is stored in Chrome storage')
    // })
  }

  add (newContent) {
    var id = this.data.length + 1
    var todo = {
      id: id,
      content: newContent,
      completed: false,
      createdAt: new Date()
    }
    this._$log.info(todo)
    this.data.push(todo)
    this.sync()
  }

  remove (todo) {
    this.data.splice(this.data.indexOf(todo), 1)
    this.sync()
  }

  removeAll () {
    this.data = []
    this.sync()
  }
}

module.exports = TodoService
