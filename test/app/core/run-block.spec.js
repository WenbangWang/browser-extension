'use strict'

describe('run block', function () {
  const run = require('../../../src/app/core/run-block')
  const $qBluebirdPolyfill = require('../../helper/$q-bluebird-polyfill')

  const logStorageService = {
    isFlushing: () => {},
    isEmpty: () => {},
    flush: () => {}
  }
  const interval = 1000

  let $interval
  let $q

  beforeEach(inject($injector => {
    $interval = $injector.get('$interval')
    $q = $injector.get('$q')
  }))

  beforeEach(function () {
    sinon.stub(logStorageService, 'isFlushing').returns(false)
    sinon.stub(logStorageService, 'isEmpty')
  })

  afterEach(function () {
    logStorageService.isFlushing.restore()
    logStorageService.isEmpty.restore()
  })

  describe('logFlusher', function () {
    const flush = run.logFlusher(logStorageService, $q)

    it('should do nothing when the logStorageService is flushing', function () {
      logStorageService.isFlushing.returns(true)

      flush()

      logStorageService.isFlushing.should.have.been.called
      logStorageService.isEmpty.should.have.not.been.called
    })

    // it('should check if the log storage is empty or not before proceeding', function () {
    //   flush()
    //
    //   logStorageService.isEmpty.should.have.been.called
    // })

    describe('storage is empty', function () {
      beforeEach(function () {
        logStorageService.isEmpty.returns($q.resolve(true))
      })

      it('should ', function () {

      })
    })
  })
})
