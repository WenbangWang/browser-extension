'use strict'

describe('LocalStorageService', () => {
  const proxyquire = require('proxyquire').noCallThru()
  const browser = require('../../../src/browser-api-mock')
  const LocalStorageService = proxyquire('../../../src/app/browser/LocalStorageService', {
    '../../browser-api': browser
  })
  const $qBluebirdPolyfill = require('../../helper/$q-bluebird-polyfill')

  let localStorageService
  let $q

  beforeEach(() => {
    sinon.stub(browser.storage.local, 'get')
    sinon.stub(browser.storage.local, 'set')
  })

  beforeEach(() => {
    $q = $qBluebirdPolyfill()
    localStorageService = new LocalStorageService($q)
  })

  afterEach(() => {
    browser.storage.local.get.restore()
    browser.storage.local.set.restore()
  })

  describe('get', () => {
    it('should return a promise which resolves to the callback parameter', () => {
      const value = 123
      browser.storage.local.get.callsArgWith(1, value)

      return localStorageService.get('test')
        .then(val => expect(val).to.equal(value))
    })

    it('should reject the returned promise if runtime.lastError is not null', () => {
      browser.runtime.lastError = 'error'
      browser.storage.local.get.callsArg(1)

      return localStorageService.get('test')
        .catch(error => {
          expect(error).to.equal(browser.runtime.lastError)
          delete browser.runtime.lastError
        })
    })
  })

  describe('set', () => {
    it('should return a promise which resolves to the callback parameter', () => {
      const value = 123
      browser.storage.local.set.callsArgWith(1, value)

      return localStorageService.set('test')
        .then(val => expect(val).to.equal(value))
    })

    it('should reject the returned promise if runtime.lastError is not null', () => {
      browser.runtime.lastError = new Error()
      browser.storage.local.set.callsArg(1)

      return localStorageService.set('test')
        .catch(error => {
          expect(error).to.equal(browser.runtime.lastError)
          delete browser.runtime.lastError
        })
    })
  })
})
