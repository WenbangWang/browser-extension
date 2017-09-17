import Vue from 'vue'
import VueRouter from 'vue-router'

import Todo from '../components/Todo/index.vue'
import TestRoute from '../components/TestRoute.vue'

import config from '../config'

import APP_MODE from '../../../constants/APP_MODE'

Vue.use(VueRouter)

export default new VueRouter({
  // We don't want the extension to impact the browser history.
  mode: config.appMode === APP_MODE.EXTENSION ? 'abstract' : 'hash',
  routes: [
    {
      path: '',
      component: Todo
    },
    {
      path: '/',
      component: Todo
    },
    {
      path: '/test-route',
      component: TestRoute
    }
  ]
})
