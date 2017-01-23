'use strict'

describe('LocalStorageService', () => {
  const proxyquire = require('proxyquire').noCallThru()
  const browser = require('../../../src/browser-api-mock')
  const LocalStorageService = proxyquire('../../../src/app/browser/LocalStorageService', {
    '../../browser-api': browser
  })
  const $qBluebirdPolyfill = require('../../helper/$q-bluebird-polyfill')

  const wrappedFunction = () => {}

  let localStorageService
  let $q
  let wrapAsyncFunction

  beforeEach(() => {
    sinon.stub(browser.storage.local, 'get')
    sinon.stub(browser.storage.local, 'set')
    wrapAsyncFunction = sinon.spy()
  })

  beforeEach(() => {
    $q = $qBluebirdPolyfill()
    localStorageService = new LocalStorageService($q, wrapAsyncFunction)
  })

  afterEach(() => {
    browser.storage.local.get.restore()
    browser.storage.local.set.restore()
  })

  describe('get', () => {
    it('should wrap browser.storage.local.get', () => {
      wrapAsyncFunction.should.have.been.calledWithExactly(browser.storage.local.get, browser.storage.local, $q)
    })

    it('should assign wrapped function to get', () => {
      wrapAsyncFunction = () => wrappedFunction
      localStorageService = new LocalStorageService($q, wrapAsyncFunction)

      expect(localStorageService.get).to.equal(wrappedFunction)
    })
  })

  describe('set', () => {
    it('should wrap browser.storage.local.set', () => {
      wrapAsyncFunction.should.have.been.calledWithExactly(browser.storage.local.set, browser.storage.local, $q)
    })

    it('should assign wrapped function to set', () => {
      wrapAsyncFunction = () => wrappedFunction
      localStorageService = new LocalStorageService($q, wrapAsyncFunction)

      expect(localStorageService.set).to.equal(wrappedFunction)
    })
  })
})
