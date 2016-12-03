'use strict'

class TodoService {
  constructor () {
    this.data = []
  }

  findAll (callback) {
    chrome.storage.sync.get('todo', keys => {
      if (keys.todo != null) {
        this.data = keys.todo
        for (var i = 0; i < this.data.length; i++) {
          this.data[i]['id'] = i + 1
        }
        console.log(this.data)
        callback(this.data)
      }
    })
  }

  sync () {
    chrome.storage.sync.set({todo: this.data}, function () {
      console.log('Data is stored in Chrome storage')
    })
  }

  add (newContent) {
    var id = this.data.length + 1
    var todo = {
      id: id,
      content: newContent,
      completed: false,
      createdAt: new Date()
    }
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
