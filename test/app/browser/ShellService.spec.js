'use strict'

describe('ShellService', () => {
  const proxyquire = require('proxyquire').noCallThru()
  const $qBluebirdPolyfill = require('../../helper/$q-bluebird-polyfill')
  const browser = require('../../../src/browser-api-mock')
  const MessagingCommandEnum = require('../../../src/lib/MessagingCommandEnum')
  const ShellService = proxyquire('../../../src/app/browser/ShellService', {
    '../../browser-api': browser
  })

  const wrappedFunction = () => {}

  let shellService
  let $q

  beforeEach(() => {
    $q = $qBluebirdPolyfill()
    shellService = new ShellService($q, () => wrappedFunction)
  })

  describe('constructor', () => {
    let wrapAsyncFunction

    beforeEach(() => {
      wrapAsyncFunction = sinon.spy()
      shellService = new ShellService($q, wrapAsyncFunction)
    })

    it('should wrap runtime.sendMessage', () => {
      wrapAsyncFunction.should.have.been.calledWithExactly(browser.runtime.sendMessage, browser.runtime, $q)
    })
  })

  describe('getEBayItems', () => {
    const eBayItems = 'eBay items'

    beforeEach(() => {
      sinon.stub(shellService, '_sendMessage').returns($q.resolve(eBayItems))
    })

    it('should sendMessage to runtime', () => {
      return shellService.getEBayItems()
        .then(() => shellService._sendMessage.should.have.been.calledWithExactly({command: MessagingCommandEnum.GET_EBAY_ITEMS}))
    })
  })
})
