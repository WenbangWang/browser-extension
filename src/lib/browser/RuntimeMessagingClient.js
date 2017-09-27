/**
 * Wrapper for the runtime messaging. It is acting like a HttpClient.
 *
 * @class
 */
export default class RuntimeMessagingClient {
  constructor (browser, wrapAsyncFunction) {
    this.provider = wrapAsyncFunction(browser.runtime.sendMessage, browser.runtime)
    this.browser = browser
  }

  /**
   * To post message asynchronously.
   *
   * @param {String} command
   * @param {Object} [data]
   * @returns {Promise<*>}
   */
  post (command, data = {}) {
    return this.provider({command, data})
  }

  /**
   * To post message synchronously.
   *
   * @param {String} command
   * @param {Object} [data]
   */
  postSync (command, data = {}) {
    this.browser.runtime.sendMessage({command, data})
  }
}
