export default class AppStateSyncService {
  constructor (localStorageService, vuexRouterSync, config, window, APP_STATE_KEY, APP_MODE) {
    this.localStorageService = localStorageService
    this.vuexRouterSync = vuexRouterSync
    this.config = config
    this.window = window
    this.APP_STATE_KEY = APP_STATE_KEY
    this.APP_MODE = APP_MODE

    this.state = {
      storeState: {
        todos: [],
        route: {
          fullPath: '/'
        }
      },
      locale: 'en'
    }
  }

  async init (store, router, i18n) {
    const appState = await this.localStorageService.get(this.APP_STATE_KEY)
    this.state = (appState && appState[this.APP_STATE_KEY]) || this.state
    const {storeState} = this.state

    store.replaceState(storeState)
    replaceRouter(this.config, this.window, this.APP_MODE)(storeState, router)
    i18n.locale = this.state.locale

    this.vuexRouterSync.sync(store, router)
    store.subscribe((mutation, storeState) => {
      this.updateStoreState(storeState)
    })
    i18n.vm.$watch('locale', newLocale => {
      this.updateLocale(newLocale)
    })
  }

  async updateStoreState (storeState) {
    this.state.storeState = storeState
    await this.localStorageService.set({[this.APP_STATE_KEY]: this.state})
  }

  async updateLocale (locale) {
    this.state.locale = locale
    await this.localStorageService.set({[this.APP_STATE_KEY]: this.state})
  }
}

function replaceRouter (config, window, APP_MODE) {
  return (storeState, router) => {
    if (config.appMode === APP_MODE.WEB_APP && window.location.hash && window.location.hash.substring(1) !== '/') {
      router.replace(window.location.hash.substring(1))
    } else {
      router.replace(storeState.route.fullPath)
    }
  }
}
