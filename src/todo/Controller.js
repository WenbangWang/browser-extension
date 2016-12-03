'use strict'

class Controller {
  constructor ($scope, todoService) {
    this._todoService = todoService
    $scope.$watch('vm._todoService.data', () => {
      this.todoList = this._todoService.data;
    })

    this._todoService.findAll((data) => {
      this.todoList = data;
      $scope.$apply();
    })
  }

  add () {
    this._todoService.add(this.newContent);
    this.newContent = '';
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
