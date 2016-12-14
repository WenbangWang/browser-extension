'use strict'

class Controller {
  constructor ($scope, todoService, $http) {
    this._todoService = todoService
    $scope.$watch('vm._todoService.data', () => {
      this.todoList = this._todoService.data;
    })

    this._todoService.findAll((data) => {
      this.todoList = data;
      $scope.$apply();
    })

    this._$http = $http
  }

  add () {
    this._todoService.add(this.newContent);
    this.newContent = '';
    // chrome.runtime.sendMessage({data: 'data'}, function (response) {
    //   console.log('got it')
    //   console.log(response)
    // })
    this._$http.get('https://epn.ebay.com/api/campaigns')
      .then(campaigns => {
        console.log(campaigns)
      })
      .catch(console.error)
    this._$http.get(chrome.extension.getURL("package.json"))
      .then(console.log)
      .catch(console.error)
  }

  remove (todo) {
    this._todoService.remove(todo);
  }

  removeAll () {
    this._todoService.removeAll();
  }

  toggleCompleted () {
    this._todoService.sync();
  }
}

module.exports = Controller
