export default class AppStateRepository {
  constructor (localStorageService, STORE_STATE_KEY, LANG_KEY) {
    this.localStorageService = localStorageService
    this.STORE_STATE_KEY = STORE_STATE_KEY
    this.LANG_KEY = LANG_KEY
  }

  async getStoreState () {
    const items = await this.localStorageService.get(this.STORE_STATE_KEY)

    return items[this.STORE_STATE_KEY]
  }

  async getOrDefaultStoreState (defaultStoreState) {
    const items = await this.localStorageService.get({[this.STORE_STATE_KEY]: defaultStoreState})

    return items[this.STORE_STATE_KEY]
  }

  async setStoreState (storeState) {
    return this.localStorageService.set({[this.STORE_STATE_KEY]: storeState})
  }

  async getLocale () {
    const items = await this.localStorageService.get(this.LANG_KEY)

    return items[this.LANG_KEY]
  }

  async getOrDefaultLocale (defaultLocale) {
    const items = await this.localStorageService.get({[this.LANG_KEY]: defaultLocale})

    return items[this.LANG_KEY]
  }

  async setLocale (locale) {
    return this.localStorageService.set({[this.LANG_KEY]: locale})
  }
}
