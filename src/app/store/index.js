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

export default store
