'use strict'

const browser = require('../browser-api')
const MessagingCommandEnum = require('../lib/MessagingCommandEnum')
const IFrameBuilder = require('./IFrameBuilder')
const IFrameStateController = require('./IFrameStateController')
const ListenerMessageHandler = require('../lib/ListenerMessageHandler')
const MessageListener = require('../lib/MessageListener')

const runtimeMessageListener = new MessageListener()
runtimeMessageListener.addMessageHandler(buildIFrameStateMessageHandler())

browser.runtime.onMessage.addListener(function () {
  return runtimeMessageListener.listen.apply(runtimeMessageListener, arguments)
})

parse()

// Experiment. Will refactor later.
function parse () {
  const startTime = Date.now()
  const anchors = document.getElementsByTagName('a')
  const title = document.getElementsByTagName('title')[0].innerHTML
  const items = []
  for (let i = 0; i < anchors.length; i++) {
    const anchor = anchors[i]
    const images = anchor.getElementsByTagName('img')
    const image = images.length ? images[0] : null

    if (image) {
      const item = {}
      item.imageLink = image.src
      item.itemLink = anchor.href
      item.title = (image.alt || anchor.title || anchor.alt || anchor.innerText || title).trim()
      items.push(item)
    }
  }
  const endTime = Date.now()

  console.log(items)
  console.log(endTime - startTime)
}

function buildIFrameStateMessageHandler () {
  const iframeStateController = buildIFrameStateController()

  const iframeStateHandler = new ListenerMessageHandler()
  iframeStateHandler.add(MessagingCommandEnum.TOGGLE_APP, iframeStateController.toggle, iframeStateController)
  iframeStateHandler.add(MessagingCommandEnum.SHOW_APP, iframeStateController.show, iframeStateController)
  iframeStateHandler.add(MessagingCommandEnum.CLOSE_APP, iframeStateController.close, iframeStateController)

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
    'z-index': '9223372036854775807'
  }
  const body = document.getElementsByTagName('body')[0]
  const id = `epn-${browser.runtime.id}`
  const src = browser.extension.getURL('index.html')

  const iframeBuilder = new IFrameBuilder(document)
  iframeBuilder.setId(id).setSrc(src).setStyles(styles)

  return new IFrameStateController(id, iframeBuilder, document, body)
}
