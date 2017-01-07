'use strict'

describe('LocalStorageService', function () {
  const LocalStorageService = require('../../../src/app/browser/LocalStorageService')
  const browser = require('../../../src/browser-api')

  let localStorageService
  let $q
  let $scope

  beforeEach(inject($injector => {
    $q = $injector.get('$q')
    $scope = $injector.get('$rootScope').$new()
  }))

  beforeEach(function () {
    sinon.stub(browser.storage.local, 'get')
    sinon.stub(browser.storage.local, 'set')
    localStorageService = new LocalStorageService($q)
  })

  afterEach(function () {
    browser.storage.local.get.restore()
    browser.storage.local.set.restore()
  })

  describe('get', function () {
    it('should return a promise which resolves to the callback parameter', function (done) {
      const value = 123
      browser.storage.local.get.callsArgWith(1, value)

      localStorageService.get('test')
        .then(val => {
          expect(val).to.equal(value)
          done()
        })

      $scope.$apply()
    })

    it('should reject the returned promise if runtime.lastError is not null', function (done) {
      browser.runtime.lastError = 'error'
      browser.storage.local.get.callsArg(1)

      localStorageService.get('test')
        .catch(error => {
          expect(error).to.equal(browser.runtime.lastError)
          delete browser.runtime.lastError
          done()
        })

      $scope.$apply()
    })
  })

  describe('set', function () {
    it('should return a promise which resolves to the callback parameter', function (done) {
      const value = 123
      browser.storage.local.set.callsArgWith(1, value)

      localStorageService.set('test')
        .then(val => {
          expect(val).to.equal(value)
          done()
        })

      $scope.$apply()
    })

    it('should reject the returned promise if runtime.lastError is not null', function (done) {
      browser.runtime.lastError = 'error'
      browser.storage.local.set.callsArg(1)

      localStorageService.set('test')
        .catch(error => {
          expect(error).to.equal(browser.runtime.lastError)
          delete browser.runtime.lastError
          done()
        })

      $scope.$apply()
    })
  })
})
