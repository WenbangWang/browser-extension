'use strict'

describe('wrapAsyncFunction', () => {
  const proxyquire = require('proxyquire').noCallThru()
  const $qBluebirdPolyfill = require('../../helper/$q-bluebird-polyfill')
  const browser = require('../../../src/browser-api-mock')
  const wrapAsyncFunction = proxyquire('../../../src/app/browser/wrapAsyncFunction', {
    '../../browser-api': browser
  })

  let promise

  beforeEach(() => {
    promise = $qBluebirdPolyfill()
  })

  it('should return a promise which resolves to the callback parameter', () => {
    const value = 123
    const arg = 'arg'
    const testFunction = sinon.stub()
    const wrappedFunction = wrapAsyncFunction(testFunction, null, promise)

    testFunction.callsArgWith(1, value)

    return wrappedFunction(arg)
      .then(val => {
        testFunction.should.have.been.calledWithExactly(arg, sinon.match.instanceOf(Function))
        expect(val).to.equal(value)
      })
  })

  it('should reject the returned promise if runtime.lastError is not null', () => {
    browser.runtime.lastError = 'error'
    const testFunction = sinon.stub()
    const wrappedFunction = wrapAsyncFunction(testFunction, null, promise)

    testFunction.callsArg(0)

    return wrappedFunction()
      .catch(error => {
        expect(error).to.equal(browser.runtime.lastError)
        delete browser.runtime.lastError
      })
  })
})
