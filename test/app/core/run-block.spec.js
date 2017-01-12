'use strict'

describe('run block', () => {
  const run = require('../../../src/app/core/run-block')
  const $qBluebirdPolyfill = require('../../helper/$q-bluebird-polyfill')

  const LOG_FLUSHER_CONFIG = {
    batchSize: 64,
    interval: 30 * 1000
  }

  const logStorageService = {
    isFlushing: () => {},
    isEmpty: () => {},
    flush: () => {},
    clear: () => {}
  }
  const $log = {
    error: () => {}
  }

  let $q

  beforeEach(() => {
    $q = $qBluebirdPolyfill()
  })

  beforeEach(() => {
    sinon.stub(logStorageService, 'isFlushing').returns(false)
    sinon.stub(logStorageService, 'isEmpty')
    sinon.stub(logStorageService, 'flush')
    sinon.stub(logStorageService, 'clear')
    sinon.spy($log, 'error')
  })

  afterEach(() => {
    logStorageService.isFlushing.restore()
    logStorageService.isEmpty.restore()
    logStorageService.flush.restore()
    logStorageService.clear.restore()
    $log.error.restore()
  })

  describe('logFlusher', () => {
    let flush

    beforeEach(() => {
      flush = run.logFlusher(logStorageService, $q, $log)
    })

    it('should do nothing when the logStorageService is flushing', () => {
      logStorageService.isFlushing.returns(true)

      return flush().then(() => {
        logStorageService.isFlushing.should.have.been.called
        logStorageService.isEmpty.should.have.not.been.called
      })
    })

    it('should check if the log storage is empty or not before proceeding', () => {
      logStorageService.isEmpty.returns($q.resolve(true))

      return flush().then(() => logStorageService.isEmpty.should.have.been.called)
    })

    describe('storage is empty', () => {
      beforeEach(() => {
        logStorageService.isEmpty.returns($q.resolve(true))
      })

      it('should do nothing by returning a promise which resolves by nothing and not calling flush', () => {
        return flush().then(() => logStorageService.flush.should.not.have.been.called)
      })
    })

    describe('storage is not empty', () => {
      beforeEach(() => {
        logStorageService.isEmpty.returns($q.resolve(false))
      })

      it('should flush the storage', () => {
        return flush().then(() => logStorageService.flush.should.have.been.called)
      })

      describe('flush failed', () => {
        const error = new Error()

        beforeEach(() => {
          logStorageService.flush.returns($q.reject(error))
        })

        it('should log the error', () => {
          return flush().then(() => $log.error.should.have.been.calledWithExactly(error))
        })

        it('should clear the storage', () => {
          return flush().then(() => logStorageService.clear.should.have.been.called)
        })

        describe('clear failed', () => {
          const anotherError = new Error()

          beforeEach(() => {
            logStorageService.clear.returns($q.reject(anotherError))
          })

          it('should log the error', () => {
            return flush().then(() => $log.error.should.have.been.calledWithExactly(anotherError))
          })
        })
      })
    })
  })

  describe('run', () => {
    describe('flush logs time to time', () => {
      let clock
      let flusher

      beforeEach(() => {
        flusher = sinon.spy()
        sinon.stub(run, 'logFlusher').returns(flusher)
        clock = sinon.useFakeTimers()
      })

      afterEach(() => {
        clock.restore()
        run.logFlusher.restore()
      })

      it('should get logFlusher', () => {
        run(logStorageService, setInterval, $q, $log, LOG_FLUSHER_CONFIG)

        run.logFlusher.should.have.been.calledWithExactly(logStorageService, $q, $log)
      })

      it('should not run logFlusher when the interval does not meet', () => {
        run(logStorageService, setInterval, $q, $log, LOG_FLUSHER_CONFIG)

        clock.tick(LOG_FLUSHER_CONFIG.interval / 2)

        flusher.should.not.have.been.called
      })

      it('should flush the logs when interval meets', () => {
        run(logStorageService, setInterval, $q, $log, LOG_FLUSHER_CONFIG)

        clock.tick(LOG_FLUSHER_CONFIG.interval)

        flusher.should.have.been.called
      })
    })
  })
})
