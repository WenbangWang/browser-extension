import browser from '../browser-api'
import MessagingCommandEnum from '../lib/MessagingCommandEnum'

import MessageListener from '../lib/MessageListener'
import ContentScriptDelegator from './ContentScriptDelegator'
import ListenerMessageHandler from '../lib/ListenerMessageHandler'

const delegatableCommands = [MessagingCommandEnum.CLOSE_APP, MessagingCommandEnum.SHOW_APP, MessagingCommandEnum.TOGGLE_APP]

const contentScriptDelegator = new ContentScriptDelegator(browser)
const contentScriptDelegatorHandler = new ListenerMessageHandler()
delegatableCommands.forEach(command => contentScriptDelegatorHandler.add(command, contentScriptDelegator.delegateToCurrentActiveTab, contentScriptDelegator))

const runtimeMessageListener = new MessageListener()
runtimeMessageListener
  .addMessageHandler(contentScriptDelegatorHandler)

browser.runtime.onMessage.addListener(function () {
  return runtimeMessageListener.listen.apply(runtimeMessageListener, arguments)
})

browser.browserAction.onClicked.addListener(tab => {
  contentScriptDelegator.delegateToTab(tab, {command: MessagingCommandEnum.TOGGLE_APP})
})

// Dummy class creations below.
// Reason not test them is because they are more declarative instead of behavioural.
