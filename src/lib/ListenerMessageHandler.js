export default class ListenerMessageHandler {
  constructor () {
    this._commandBehaviorMap = {}
    this._commandContextMap = {}
  }

  /**
   * Run the message handler based on the given message payload.
   *
   * @param {MessagePayload} message - Message payload object to be passed along.
   * @param {String} sender - ID represents sender.
   * @param {sendResponseCallback} sendResponse - A callback function to be called to send response to the message sender.
   * @returns {Boolean}
   */
  run (message, sender, sendResponse) {
    if (!message || typeof message.command === 'undefined') {
      return false
    }

    return this.execute(message.command, message, sender, sendResponse)
  }

  /**
   * To execute a single behavior based on the existence of the given command.
   * Return false if it does not exist
   * otherwise execute the behavior with message, sender, sendResponse and return the value "behavior" returned if it is boolean or return true by default.
   *
   * @param {String} command
   * @param {MessagePayload} message - Message payload object to be passed along.
   * @param {String} sender - ID represents sender.
   * @param {sendResponseCallback} sendResponse - A callback function to be called to send response to the message sender.
   * @returns {Boolean}
   */
  execute (command, message, sender, sendResponse) {
    const behavior = this._commandBehaviorMap[command]
    if (!behavior) {
      return false
    }

    const result = behavior.call(this._commandContextMap[command], message, sender, sendResponse)

    return typeof result === 'boolean' ? result : true
  }

  /**
   * To add command and behavior to the message handler.
   *
   * @param {String} command - The command we receive for further action.
   * @param {Function} behavior - What we should do when we receive a command.
   *                              It will be invoked with a {@link MessagePayload}, a sender ID and a callback {@link sendResponseCallback}.
   *                              Return true means it is supposed to wait for the callback {@link sendResponseCallback} to be called asynchronously.
   * @param {Object} [context] - The context which the behavior should run against.
   * @returns {ListenerMessageHandler}
   */
  add (command, behavior, context) {
    if (!(behavior instanceof Function)) {
      throw new Error('behavior needs to be a function')
    }

    this._commandBehaviorMap[command] = behavior
    this._commandContextMap[command] = context

    return this
  }

  static wrapBehaviorIntoSync (behavior) {
    return function behaviorSyncWrapper () {
      behavior.apply(this, arguments)
      return false
    }
  }
}

/**
 * The payload which will be used to communicate between app and browser extension.
 *
 * @typedef {Object} MessagePayload
 *
 * @property {String} command
 * @property {Object} data
 * @property {Number} [data.appId] - Optional identifier to represent where the payload is coming from.
 */

/**
 * Since there is only one parameter allowed to pass through sendResponse, an object is defined to indicate if there an error or not.
 *
 * @callback sendResponseCallback
 *
 * @param {Object} response
 * @param {Object} response.error
 * @param {Object} response.data
 */
