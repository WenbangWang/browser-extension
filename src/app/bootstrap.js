import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'

import store from './store'
import i18n from './i18n'
import router from './router'

import App from './components/App.vue'

import appStateSyncService from './lib/app-state-sync-service'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)

appStateSyncService.init(store, router, i18n)
  .then(() => {
    new Vue({ // eslint-disable-line no-new
      el: '#app',
      i18n,
      store,
      render: h => h(App),
      router
    })
  })
