import RuntimeMessagingClient from '../../../src/lib/browser/RuntimeMessagingClient'
import browser from '../../../src/browser-api-mock'

describe('RuntimeMessagingClient', () => {
  let wrapAsyncFunction
  let provider
  let runtimeMessagingClient

  beforeEach(() => {
    provider = sinon.stub()
    wrapAsyncFunction = sinon.stub()
    sinon.stub(browser.runtime, 'sendMessage')

    wrapAsyncFunction.returns(provider)
    provider.resolves()
  })

  beforeEach(() => {
    runtimeMessagingClient = new RuntimeMessagingClient(browser, wrapAsyncFunction)
  })

  afterEach(() => {
    browser.runtime.sendMessage.restore()
  })

  describe('constructor', () => {
    it('should wrap runtime sendMessage', () => {
      wrapAsyncFunction.should.have.been.calledWithExactly(browser.runtime.sendMessage, browser.runtime)
    })
  })

  describe('post', () => {
    it('should invoke the wrapped function with the message payload', () => {
      const command = 'commend'
      const data = {
        foo: 'bar'
      }

      return runtimeMessagingClient.post(command, data)
        .then(() => provider.should.have.been.calledWithExactly({command, data}))
    })

    it('should post the message payload with empty data object when data is not provided', () => {
      const command = 'command'

      return runtimeMessagingClient.post(command)
        .then(() => provider.should.have.been.calledWithExactly({command, data: {}}))
    })
  })

  describe('postSync', () => {
    it('should send message synchronously', () => {
      const command = 'commend'
      const data = {
        foo: 'bar'
      }

      runtimeMessagingClient.postSync(command, data)

      browser.runtime.sendMessage.should.have.been.calledWithExactly({command, data})
    })

    it('should post the message payload with empty data object when data is not provided', () => {
      const command = 'command'

      runtimeMessagingClient.postSync(command)

      browser.runtime.sendMessage.should.have.been.calledWithExactly({command, data: {}})
    })
  })
})
