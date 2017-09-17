function todoActions (localStorageService, todoMutationConstants, todoMiscConstants) {
  const {TODO_KEY} = todoMiscConstants
  return {
    findAll ({commit}) {
      return localStorageService.get(TODO_KEY)
        .then(keys => {
          if (keys[TODO_KEY] !== null) {
            commit({
              type: todoMutationConstants.FIND_ALL,
              todos: keys[TODO_KEY] || []
            })
          }
        })
    }
  }
}

export default todoActions
