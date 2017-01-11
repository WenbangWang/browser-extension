'use strict'

const Stacktrace = require('stacktrace-js')

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

  methods.forEach(method => {
    $delegate[method] = function () {
      const message = [].slice.call(arguments)
      originalReference[method].apply(null, arguments)
      const logStorageService = $injector.get('logStorageService')
      const potentialError = message[0]
      let getStacktrace = Stacktrace.get()

      if (potentialError instanceof Error) {
        getStacktrace = Stacktrace.fromError(potentialError)
      }

      getStacktrace.then(stacktrace => {
        const logBody = buildLogBody(method, message, stacktrace)

        logStorageService.add(logBody)
      })
    }
  })

  return $delegate
}

function buildLogBody (type, message, stacktrace) {
  return {
    timestamp: Date.now(),
    type,
    message,
    stacktrace
  }
}

const self = module.exports = logConfig
self.logDecorator = logDecorator
