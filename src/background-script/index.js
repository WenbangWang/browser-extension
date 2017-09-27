import * as jsLogger from 'js-logger'

import browser from '../browser-api'
import ShellControlCommand from '../constants/ShellControlCommand'
import LoggerCommand from '../constants/LoggerCommand'

import MessageListener from '../lib/MessageListener'
import ListenerMessageHandler from '../lib/ListenerMessageHandler'

import contentScriptDelegator from './content-script-delegator'
import appStateRepositoryHandler from './app-state-repository-handler'

const delegatableShellControlCommands = [ShellControlCommand.CLOSE, ShellControlCommand.SHOW, ShellControlCommand.TOGGLE]

const runtimeMessageListener = buildRuntimeMessageListener()

browser.runtime.onMessage.addListener(runtimeMessageListener.listen.bind(runtimeMessageListener))

browser.browserAction.onClicked.addListener(tab => {
  contentScriptDelegator.delegateToTab(tab, {command: ShellControlCommand.TOGGLE})
})

// Dummy class creations below.
// Reason not test them is because they are more declarative instead of behavioural.

function buildRuntimeMessageListener () {
  const contentScriptDelegatorHandler = buildContentScriptDelegatorHandler()
  const loggerHandler = buildLoggerHandler()
  const runtimeMessageListener = new MessageListener()

  runtimeMessageListener
    .addMessageHandler(contentScriptDelegatorHandler)
    .addMessageHandler(loggerHandler)
    .addMessageHandler(appStateRepositoryHandler)

  return runtimeMessageListener
}

function buildContentScriptDelegatorHandler () {
  const contentScriptDelegatorHandler = new ListenerMessageHandler()

  delegatableShellControlCommands.forEach(command => contentScriptDelegatorHandler.add(command, ListenerMessageHandler.wrapBehaviorIntoSync(contentScriptDelegator.delegateToCurrentActiveTab), contentScriptDelegator))

  return contentScriptDelegatorHandler
}

function buildLoggerHandler () {
  const loggerHandler = new ListenerMessageHandler()

  jsLogger.useDefaults()
  Object.keys(LoggerCommand)
    .map(command => command.toLowerCase())
    .forEach(command => loggerHandler.add(command, ListenerMessageHandler.wrapBehaviorIntoSync(({data}) => jsLogger[command](...data.messages))))

  return loggerHandler
}
