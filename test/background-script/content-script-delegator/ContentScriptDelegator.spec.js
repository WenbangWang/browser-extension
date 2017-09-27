import ContentScriptDelegator from '../../../src/background-script/content-script-delegator/ContentScriptDelegator'
import browser from '../../../src/browser-api-mock'

describe('ContentScriptDelegator', () => {
  const tab = {
    id: 123
  }
  const message = 'message'
  const sender = 'sender'
  const sendResponse = 'send response'

  let contentScriptDelegator

  beforeEach(() => {
    contentScriptDelegator = new ContentScriptDelegator(browser)
  })

  describe('delegateToTab', () => {
    beforeEach(() => {
      sinon.stub(browser.tabs, 'sendMessage')
    })

    afterEach(() => {
      browser.tabs.sendMessage.restore()
    })

    it('should send message to the given tab id', () => {
      contentScriptDelegator.delegateToTab(tab, message, sendResponse)

      browser.tabs.sendMessage.should.have.been.calledWithExactly(tab.id, message, sendResponse)
    })
  })

  describe('delegateToCurrentActiveTab', () => {
    beforeEach(() => {
      sinon.stub(browser.tabs, 'query')
    })

    afterEach(() => {
      browser.tabs.query.restore()
    })

    it('should query for current active window', () => {
      contentScriptDelegator.delegateToCurrentActiveTab(message, sender, sendResponse)

      browser.tabs.query.should.have.been.calledWithExactly({
        active: true,
        currentWindow: true
      }, sinon.match.instanceOf(Function))
    })

    describe('got tabs', () => {
      const tabs = [tab]

      beforeEach(() => {
        sinon.stub(contentScriptDelegator, 'delegateToTab')
      })

      afterEach(() => {
        contentScriptDelegator.delegateToTab.restore()
      })

      it('should delegate to the first found tab', () => {
        browser.tabs.query.callsArgWith(1, tabs)
        contentScriptDelegator.delegateToCurrentActiveTab(message, sender, sendResponse)

        contentScriptDelegator.delegateToTab.should.have.been.calledWithExactly(tabs[0], message, sendResponse)
      })
    })
  })
})
