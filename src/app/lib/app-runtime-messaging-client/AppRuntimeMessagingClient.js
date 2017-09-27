import RuntimeMessagingClient from '../../../lib/browser/RuntimeMessagingClient'

export default class AppRuntimeMessagingClient extends RuntimeMessagingClient {
  constructor (meta, browser, wrapAsyncFunction) {
    super(browser, wrapAsyncFunction)
    this.meta = meta
  }

  /**
   * Wrap {@link RuntimeMessagingClient#post} with {@link AppMeta#appId}
   *
   * @param {String} command
   * @param {Object} [data]
   * @override
   */
  post (command, data = {}) {
    const {appId} = this.meta

    return super.post(command, {appId, ...data})
  }

  /**
   * Wrap {@link RuntimeMessagingClient#postSync} with {@link AppMeta#appId}
   *
   * @param {String} command
   * @param {Object} [data]
   * @override
   */
  postSync (command, data = {}) {
    const {appId} = this.meta

    super.postSync(command, {appId, ...data})
  }
}
