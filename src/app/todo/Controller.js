'use strict'

class Controller {

  /* @ngInject */
  constructor ($scope, todoService, $http, logStorageService, $log) {
    this._todoService = todoService
    $scope.$watch('vm._todoService.data', () => {
      this.todoList = this._todoService.data
      $log.info(this.todoList)
    })

    this._todoService.findAll((data) => {
      this.todoList = data
    })

    this._$http = $http
    this._logStorageService = logStorageService
  }

  add () {
    this._todoService.add(this.newContent)
    this.newContent = ''
    this._logStorageService.flush()
    this._logStorageService.size().then(console.log)
    this._logStorageService.isEmpty().then(console.log)

    // chrome.runtime.sendMessage({data: 'data'}, function (response) {
    //   console.log('got it')
    //   console.log(response)
    // })
    // this._$http.get('https://epn.ebay.com/api/campaigns')
    //   .then(campaigns => {
    //     console.log(campaigns)
    //   })
    //   .catch(console.error)
    // this._$http.get(chrome.extension.getURL("package.json"))
    //   .then(console.log)
    //   .catch(console.error)
  }

  remove (todo) {
    this._todoService.remove(todo)
  }

  removeAll () {
    this._todoService.removeAll()
  }

  toggleCompleted () {
    this._todoService.sync()
  }
}

module.exports = Controller
