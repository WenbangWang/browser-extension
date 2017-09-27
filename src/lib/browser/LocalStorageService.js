/**
 * A wrapper around browser.storage.locale and also provides promisified getter and setter.
 *
 * @class
 */
export default class LocalStorageService {
  constructor (browser, wrapAsyncFunction) {
    this.get = wrapAsyncFunction(browser.storage.local.get, browser.storage.local)
    this.set = wrapAsyncFunction(browser.storage.local.set, browser.storage.local)
  }
}