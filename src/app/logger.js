import * as jsLogger from 'js-logger'
import errorStackParser from 'error-stack-parser'

import {runtimeMessagingClient} from '../lib/browser'
import config from './config'

import LoggerCommand from '../constants/LoggerCommand'
import APP_MODE from '../../constants/APP_MODE'

const {logLevel = 'debug', appMode} = config

appMode === APP_MODE.EXTENSION ? jsLogger.setHandler(logTransporter) : jsLogger.useDefaults()
jsLogger.setLevel(logLevelToJSLogLevel())

jsLogger.getInstance = jsLogger.get.bind(jsLogger)

export default jsLogger

function logTransporter (messages, context) {
  const {level} = context
  // parse array-like "arguments" into array
  messages = [...messages]
  if (level === jsLogger.ERROR) {
    messages = messages.map(message => message instanceof Error ? {
      message: message.message,
      stackFrames: errorStackParser.parse(message)
    } : message)
  }

  runtimeMessagingClient.postSync(jsLogLevelToLoggerCommand(level, LoggerCommand), {messages})
}

function logLevelToJSLogLevel () {
  return jsLogger[logLevel.toUpperCase()] || jsLogger.DEBUG
}

function jsLogLevelToLoggerCommand (jsLogLevel) {
  return LoggerCommand[jsLogLevel.name] || LoggerCommand.ERROR
}
