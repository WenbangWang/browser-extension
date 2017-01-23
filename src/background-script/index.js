'use strict'

const browser = require('../browser-api')
const MessagingCommandEnum = require('../lib/MessagingCommandEnum')

const MessageListener = require('../lib/MessageListener')
const ContentScriptDelegator = require('./ContentScriptDelegator')
const ListenerMessageHandler = require('../lib/ListenerMessageHandler')

const delegatableCommands = [MessagingCommandEnum.GET_EBAY_ITEMS, MessagingCommandEnum.CLOSE_APP, MessagingCommandEnum.SHOW_APP, MessagingCommandEnum.TOGGLE_APP]

const contentScriptDelegator = new ContentScriptDelegator(browser)
const contentScriptDelegatorHandler = new ListenerMessageHandler()
delegatableCommands.forEach(command => contentScriptDelegatorHandler.add(command, contentScriptDelegator.delegateToCurrentActiveTab, contentScriptDelegator))

const runtimeMessageListener = new MessageListener()
runtimeMessageListener.addMessageHandler(contentScriptDelegatorHandler)

browser.runtime.onMessage.addListener(function () {
  return runtimeMessageListener.listen.apply(runtimeMessageListener, arguments)
})

browser.browserAction.onClicked.addListener(tab => {
  contentScriptDelegator.delegateToTab(tab, {command: MessagingCommandEnum.TOGGLE_APP})
})
