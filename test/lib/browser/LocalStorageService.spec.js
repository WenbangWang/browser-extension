import browser from '../../../src/browser-api-mock'
import LocalStorageService from '../../../src/lib/browser/LocalStorageService'

describe('LocalStorageService', () => {
  const wrappedFunction = () => {}

  let localStorageService
  let wrapAsyncFunction

  beforeEach(() => {
    sinon.stub(browser.storage.local, 'get')
    sinon.stub(browser.storage.local, 'set')
    wrapAsyncFunction = sinon.spy()
  })

  beforeEach(() => {
    localStorageService = new LocalStorageService(browser, wrapAsyncFunction)
  })

  afterEach(() => {
    browser.storage.local.get.restore()
    browser.storage.local.set.restore()
  })

  describe('get', () => {
    it('should wrap browser.storage.local.get', () => {
      wrapAsyncFunction.should.have.been.calledWithExactly(browser.storage.local.get, browser.storage.local)
    })

    it('should assign wrapped function to get', () => {
      wrapAsyncFunction = () => wrappedFunction
      localStorageService = new LocalStorageService(browser, wrapAsyncFunction)

      expect(localStorageService.get).to.equal(wrappedFunction)
    })
  })

  describe('set', () => {
    it('should wrap browser.storage.local.set', () => {
      wrapAsyncFunction.should.have.been.calledWithExactly(browser.storage.local.set, browser.storage.local)
    })

    it('should assign wrapped function to set', () => {
      wrapAsyncFunction = () => wrappedFunction
      localStorageService = new LocalStorageService(browser, wrapAsyncFunction)

      expect(localStorageService.set).to.equal(wrappedFunction)
    })
  })
})
