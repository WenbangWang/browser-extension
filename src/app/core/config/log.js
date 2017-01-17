'use strict'

const ErrorStackParser = require('error-stack-parser')

/* @ngInject */
function logConfig ($provide) {
  $provide.decorator('$log', logDecorator)
}

/* @ngInject */
function logDecorator ($delegate, $injector) {
  const methods = ['log', 'info', 'warn', 'debug', 'error']
  const originalReference = methods.reduce((map, method) => {
    map[method] = $delegate[method]
    return map
  }, {})

  Object.assign($delegate, getLoggers($injector, originalReference))

  $delegate.getInstance = context => getLoggers($injector, originalReference, context)

  return $delegate
}

function getLoggers ($injector, originalReference, context) {
  const loggers = {}

  Object.keys(originalReference).reduce((map, method) => {
    map[method] = function () {
      const message = [].slice.call(arguments)
      originalReference[method].apply(null, arguments)
      // This has to be inside of each individual function to avoid circular dependency.
      const logStorageService = $injector.get('logStorageService')
      const potentialError = message[0]
      const logBody = buildLogBody(method)

      context && (logBody.context = context)

      if (potentialError instanceof Error) {
        const stacktrace = ErrorStackParser.parse(potentialError)

        logBody.message = potentialError.message
        logBody.stacktrace = stacktrace
      } else {
        logBody.message = message
      }

      logStorageService.add(logBody)
    }

    return map
  }, loggers)

  return loggers
}

function buildLogBody (type) {
  return {
    timestamp: Date.now(),
    type
  }
}

const self = module.exports = logConfig
self.logDecorator = logDecorator
