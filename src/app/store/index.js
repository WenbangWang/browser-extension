import Vue from 'vue'
import Vuex from 'vuex'

import todoActions from './actions/todo'
import todoMutations from './mutations/todo'

Vue.use(Vuex)

const state = {
  todos: []
}
const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state,
  mutations: {
    ...todoMutations
  },
  actions: {
    ...todoActions
  }
})

if (module.hot) {
  module.hot.accept(['./actions/todo', './mutations/todo'], () => {
    const todoMutations = require('./mutations/todo').default
    const todoActions = require('./actions/todo').default

    store.hotUpdate({
      mutations: {
        ...todoMutations
      },
      actions: {
        ...todoActions
      }
    })
  })
}

export default store
