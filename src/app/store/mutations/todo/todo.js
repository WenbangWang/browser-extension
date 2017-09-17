function todoMutations (localStorageService, todoMutationConstants, todoMiscConstants) {
  const {ADD, SYNC, REMOVE, REMOVE_ALL, FIND_ALL, TOGGLE} = todoMutationConstants
  const mutations = {
    [FIND_ALL] (state, {todos}) {
      state.todos = todos
    },
    [ADD] (state, {todo}) {
      state.todos.push(todo)
      mutations[SYNC](state)
    },
    [SYNC] ({todos}) {
      localStorageService.set({[todoMiscConstants.TODO_KEY]: todos})
    },
    [REMOVE] (state, {todo}) {
      state.todos.splice(state.todos.indexOf(todo), 1)
      mutations[SYNC](state)
    },
    [REMOVE_ALL] (state) {
      state.todos = []
      mutations[SYNC](state)
    },
    [TOGGLE] (state, {todo}) {
      todo.completed = !todo.completed
    }
  }

  return mutations
}

export default todoMutations
