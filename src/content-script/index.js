'use strict'

const browser = require('../browser-api')
const MessagingCommandEnum = require('../lib/MessagingCommandEnum')
const IFrameBuilder = require('./IFrameBuilder')
const IFrameStateController = require('./IFrameStateController')
const ListenerMessageHandler = require('../lib/ListenerMessageHandler')
const MessageListener = require('../lib/MessageListener')

const styles = {
  'display': 'block',
  'position': 'fixed',
  'height': '100%',
  'width': '100%',
  'top': '0',
  'left': '0',
  'bottom': '0',
  'right': '0',
  'margin': '0',
  'clip': 'auto',
  'z-index': '9223372036854775807'
}
const body = document.getElementsByTagName('body')[0]
const id = `epn-${browser.runtime.id}`
const src = browser.extension.getURL('index.html')

const iframeBuilder = new IFrameBuilder(document)
iframeBuilder.setId(id).setSrc(src).setStyles(styles)

const iframeStateController = new IFrameStateController(id, iframeBuilder, document, body)

const iframeStateHandler = new ListenerMessageHandler()
iframeStateHandler.add(MessagingCommandEnum.TOGGLE_APP, iframeStateController.toggle, iframeStateController)
iframeStateHandler.add(MessagingCommandEnum.SHOW_APP, iframeStateController.show, iframeStateController)
iframeStateHandler.add(MessagingCommandEnum.CLOSE_APP, iframeStateController.close, iframeStateController)

const runtimeMessageListener = new MessageListener()
runtimeMessageListener.addMessageHandler(iframeStateHandler)

browser.runtime.onMessage.addListener(function () {
  return runtimeMessageListener.listen.apply(runtimeMessageListener, arguments)
})
