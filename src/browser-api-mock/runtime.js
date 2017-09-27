import MessageListener from '../lib/MessageListener'

const messageListener = new MessageListener()
let appStateRepositoryHandler

export default {
  sendMessage: (message, callback) => {
    if (!appStateRepositoryHandler) {
      // Need to require dynamically to avoid circular dependencies.
      appStateRepositoryHandler = require('../background-script/app-state-repository-handler').default
      messageListener.addMessageHandler(appStateRepositoryHandler)
    }

    messageListener.listen(message, {}, callback || function () {})
  }
}
