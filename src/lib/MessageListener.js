'use strict'

const ListenerMessageHandler = require('./ListenerMessageHandler')

class MessageListener {
  constructor () {
    this._messageHandlers = []
  }

  listen (message, sender, sendResponse) {
    for (let i = 0, length = this._messageHandlers.length; i < length; i++) {
      const handler = this._messageHandlers[i]

      if (handler.run(message, sender, sendResponse)) {
        // return true to indicate I want to send the response async
        // see https://developer.chrome.com/extensions/runtime#event-onMessage
        return true
      }
    }
  }

  addMessageHandler (messageHandler) {
    if (!(messageHandler instanceof ListenerMessageHandler)) {
      throw new Error('message handler has to be an instance of ListenerMessageHandler')
    }

    this._messageHandlers.push(messageHandler)
  }
}

module.exports = MessageListener
