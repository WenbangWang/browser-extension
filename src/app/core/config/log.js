'use strict'

const Stacktrace = require('stacktrace-js')

/* @ngInject */
function logConfig ($provide) {
  $provide.decorator('$log', logDecorator)
}

/* @ngInject */
function logDecorator ($delegate, $injector) {
  const methods = ['log', 'info', 'warn', 'debug']
  const originalReference = methods.map(method => $delegate[method])
  const logStorageService = $injector.get('logStorageService')

  methods.forEach(method => {
    $delegate[method] = function () {
      const message = [].slice.call(arguments)
      originalReference[method].apply(null, arguments)

      Stacktrace.get().then(stacktrace => {
        const logBody = buildLogBody(method, message, stacktrace)
        logStorageService.add(logBody)
      })
    }
  })

  return $delegate
}

function buildLogBody (type, message, stackTrace) {
  return {
    timestamp: Date.now(),
    type,
    message,
    stackTrace
  }
}

const self = module.exports = logConfig
self.logDecorator = logDecorator
