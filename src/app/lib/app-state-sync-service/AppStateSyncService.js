import logger from '../../logger'

/**
 * A service to sync application state with persisted storage
 *
 * @class
 */
export default class AppStateSyncService {
  /**
   *
   * @param {RuntimeMessagingClient} runtimeMessagingClient
   * @param {AppLanguageService} appLanguageService
   * @param {VuexRouterSync} vuexRouterSync
   * @param {EPNExtensionConfig} config
   * @param {Window} window
   * @param {AppStateCommand} AppStateCommand
   * @param {APP_MODE} APP_MODE
   */
  constructor (runtimeMessagingClient, appLanguageService, vuexRouterSync, config, window, AppStateCommand, APP_MODE) {
    this.runtimeMessagingClient = runtimeMessagingClient
    this.vuexRouterSync = vuexRouterSync
    this.config = config
    this.window = window
    this.AppStateCommand = AppStateCommand
    this.APP_MODE = APP_MODE

    this.state = {
      storeState: {
        todos: [],
        route: {
          fullPath: '/'
        }
      },
      locale: appLanguageService.getCurrentLocale()
    }

    this.logger = logger.getInstance('AppStateSyncService')
  }

  /**
   * It loads the persisted state from last time and either use that or default state to initialize the app.
   * It also adds listeners to store and i18n to sync the current in-memory app state to a persisted storage.
   *
   * @param {Store} store
   * @param {VueRouter} router
   * @param {VueI18n} i18n
   * @returns {Promise.<void>}
   */
  async init (store, router, i18n) {
    const [storeState, locale] =
      await Promise.all([
        this.runtimeMessagingClient.post(this.AppStateCommand.GET_OR_DEFAULT_STORE_STATE, {storeState: this.state.storeState}),
        this.runtimeMessagingClient.post(this.AppStateCommand.GET_OR_DEFAULT_LOCALE, {locale: this.state.locale})
      ])

    this.logger.debug(`Current app store state is ${JSON.stringify(storeState, null, 2)} and locale is ${locale}`)

    store.replaceState(storeState)
    replaceRouter(this.config, this.window, this.APP_MODE)(storeState, router)
    i18n.locale = locale
    this.vuexRouterSync.sync(store, router)

    store.subscribe((mutation, storeState) => {
      this.runtimeMessagingClient.postSync(this.AppStateCommand.UPDATE_STORE_STATE, {storeState})
    })
    i18n.vm.$watch('locale', newLocale => {
      this.runtimeMessagingClient.postSync(this.AppStateCommand.UPDATE_LOCALE, {locale: newLocale})
    })
  }
}

function replaceRouter (config, window, APP_MODE) {
  return (storeState, router) => {
    if (config.appMode === APP_MODE.WEB_APP && isNotOnBaseUrl(window)) {
      router.replace(window.location.hash.substring(1))
    } else {
      router.replace(storeState.route.fullPath)
    }
  }
}

function isNotOnBaseUrl (window) {
  return window.location.hash && window.location.hash.substring(1) !== '/'
}
