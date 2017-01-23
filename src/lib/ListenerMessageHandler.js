'use strict'

class ListenerMessageHandler {
  constructor () {
    this._commandBehaviorMap = {}
    this._commandContextMap = {}
  }

  run (message, sender, sendResponse) {
    if (!message || typeof message.command === 'undefined') {
      return false
    }

    return this.execute(message.command, message, sender, sendResponse)
  }

  execute (command, message, sender, sendResponse) {
    const behavior = this._commandBehaviorMap[command]
    if (!behavior) {
      return false
    }

    behavior.call(this._commandContextMap[command], message, sender, sendResponse)

    return true
  }

  add (command, behavior, context) {
    if (!(behavior instanceof Function)) {
      throw new Error('behavior needs to be a function')
    }

    this._commandBehaviorMap[command] = behavior
    this._commandContextMap[command] = context

    return this
  }
}

module.exports = ListenerMessageHandler
