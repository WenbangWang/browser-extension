import browser from '../browser-api'

import MessagingCommandEnum from '../lib/MessagingCommandEnum'

import IFrameBuilder from './IFrameBuilder'
import IFrameStateController from './IFrameStateController'
import ListenerMessageHandler from '../lib/ListenerMessageHandler'
import MessageListener from '../lib/MessageListener'

const runtimeMessageListener = buildRuntimeMessageListener()

browser.runtime.onMessage.addListener(function () {
  return runtimeMessageListener.listen.apply(runtimeMessageListener, arguments)
})

// Dummy class creations below.
// Reason not test them is because they are more declarative instead of behavioural.

function buildRuntimeMessageListener () {
  const runtimeMessageListener = new MessageListener()
  runtimeMessageListener
    .addMessageHandler(buildIFrameStateMessageHandler())

  return runtimeMessageListener
}

function buildIFrameStateMessageHandler () {
  const iframeStateController = buildIFrameStateController()

  const iframeStateHandler = new ListenerMessageHandler()
  iframeStateHandler
    .add(MessagingCommandEnum.TOGGLE_APP, iframeStateController.toggle, iframeStateController)
    .add(MessagingCommandEnum.SHOW_APP, iframeStateController.show, iframeStateController)
    .add(MessagingCommandEnum.CLOSE_APP, iframeStateController.close, iframeStateController)

  return iframeStateHandler
}

function buildIFrameStateController () {
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
    'z-index': '9223372036854775807',
    'background-color': 'white'
  }
  const body = document.getElementsByTagName('body')[0]
  const id = `epn-${browser.runtime.id}`
  const src = browser.extension.getURL('index.html')

  const iframeBuilder = new IFrameBuilder(document)
  iframeBuilder
    .setId(id)
    .setSrc(src)
    .setStyles(styles)

  return new IFrameStateController(id, iframeBuilder, document, body)
}
