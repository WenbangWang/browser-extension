import AppRuntimeMessagingClient from '../../../../src/app/lib/app-runtime-messaging-client/AppRuntimeMessagingClient'
import RuntimeMessagingClient from '../../../../src/lib/browser/RuntimeMessagingClient'
import browser from '../../../../src/browser-api-mock'
import wrapAsyncFunctionFactory from '../../../../src/lib/browser/wrapAsyncFunctionFactory'

describe('AppRuntimeMessagingClient', () => {
  const meta = {
    appId: 123
  }
  const command = 'command'

  let appRuntimeMessagingClient

  beforeEach(() => {
    sinon.stub(RuntimeMessagingClient.prototype, 'post')
    sinon.stub(RuntimeMessagingClient.prototype, 'postSync')
  })

  beforeEach(() => {
    appRuntimeMessagingClient = new AppRuntimeMessagingClient(meta, browser, wrapAsyncFunctionFactory(browser))
  })

  afterEach(() => {
    RuntimeMessagingClient.prototype.post.restore()
    RuntimeMessagingClient.prototype.postSync.restore()
  })

  describe('post', () => {
    it('should wrap post to call with appId in the payload', () => {
      const data = {
        foo: 'bar'
      }

      appRuntimeMessagingClient.post(command, data)

      RuntimeMessagingClient.prototype.post.should.have.been.calledWithExactly(command, {appId: meta.appId, ...data})
    })
  })

  describe('postSync', () => {
    it('should wrap post to call with appId in the payload', () => {
      const data = {
        foo: 'bar'
      }

      appRuntimeMessagingClient.postSync(command, data)

      RuntimeMessagingClient.prototype.postSync.should.have.been.calledWithExactly(command, {appId: meta.appId, ...data})
    })
  })
})
