global.window = {}

const proxyquire = require('proxyquire').noCallThru()
const logger = proxyquire('../../src/app/logger', {
  '../lib/browser': {
    runtimeMessagingClient: {
      postSync: sinon.stub()
    }
  }
}).default

const loggerMethods = Object.keys(logger)
  .filter(method => typeof logger[method] === 'function')

before(() => {
  loggerMethods.forEach(method => sinon.stub(logger, method))
  logger.getInstance.returns(logger)
})

after(() => {
  loggerMethods.forEach(method => {
    logger[method].restore()
  })
})
