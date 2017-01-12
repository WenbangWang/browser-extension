'use strict'

describe('log config', () => {
  const logConfig = require('../../../../src/app/core/config/log')
  const Stacktrace = require('stacktrace-js')
  const Promise = require('bluebird')

  const methods = ['log', 'info', 'warn', 'debug', 'error']
  const logStorageService = {
    add: () => {}
  }
  const $injector = {
    get: () => {}
  }

  let $delegate
  let $delegateStubs

  beforeEach(() => {
    $delegateStubs = {}

    $delegate = methods.reduce((map, method) => {
      map[method] = () => {}
      return map
    }, {})
  })

  beforeEach(() => {
    methods.forEach(method => ($delegateStubs[method] = sinon.stub($delegate, method)))

    sinon.stub($injector, 'get').returns(logStorageService)

    sinon.stub(Stacktrace, 'get')
    sinon.stub(Stacktrace, 'fromError').returns(Promise.resolve())

    sinon.stub(logStorageService, 'add')
  })

  afterEach(() => {
    methods.forEach(method => $delegateStubs[method].restore())

    $injector.get.restore()

    Stacktrace.get.restore()
    Stacktrace.fromError.restore()

    logStorageService.add.restore()
  })

  describe('decorator', () => {
    let promises

    beforeEach(() => {
      promises = []
      methods.forEach((method, index) => {
        const promise = Promise.resolve()
        promises.push(promise)
        Stacktrace.get.onCall(index).returns(promise)
      })

      logConfig.logDecorator($delegate, $injector)
    })

    it('should call the original method from $delegate', () => {
      const arg1 = 'arg1'
      const arg2 = 'arg2'

      methods.forEach(method => $delegate[method].call(null, arg1, arg2))

      return Promise.all(promises)
        .then(() => methods.forEach(method => $delegateStubs[method].should.have.been.calledWithExactly(arg1, arg2)))
    })

    it('should inject logStorageService from $injector', () => {
      methods.forEach(method => $delegate[method]())

      return Promise.all(promises)
        .then(() => {
          $injector.get.should.have.been.calledWithExactly('logStorageService')
          $injector.get.should.have.callCount(methods.length)
        })
    })

    it('should get stack trace', () => {
      methods.forEach(method => $delegate[method]())

      return Promise.all(promises)
        .then(() => Stacktrace.get.should.have.callCount(methods.length))
    })

    it('should add log body to log storage service with properties', () => {
      const arg1 = 'arg1'
      const arg2 = 'arg2'
      const stacktrace = 'stacktrace'
      const promises = []
      methods.forEach((method, index) => {
        const promise = Promise.resolve(stacktrace)
        promises.push(promise)
        Stacktrace.get.onCall(index).returns(promise)
      })

      methods.forEach(method => $delegate[method].call(null, arg1, arg2))

      return Promise.all(promises).then(() => {
        methods.forEach((method, index) => {
          const args = logStorageService.add.args[index][0]

          expect(args).to.have.property('type', method)
          expect(args).to.have.property('message').that.is.an('array').that.eql([arg1, arg2])
          expect(args).to.have.property('stacktrace', stacktrace)
        })
      })
    })

    it('should get error stack when the first argument is an instance of Error', () => {
      const stacktrace = 'stacktrace'
      const promise = Promise.resolve(stacktrace)
      const error = new Error()
      Stacktrace.fromError.returns(promise)

      $delegate.error(error)

      return promise.then(() => Stacktrace.fromError.should.have.been.calledWithExactly(error))
    })
  })

  describe('config', () => {
    const $provide = {
      decorator: () => {}
    }

    beforeEach(() => {
      sinon.stub($provide, 'decorator')
    })

    afterEach(() => {
      $provide.decorator.restore()
    })

    it('should decorate $log with logDecorator', () => {
      logConfig($provide)

      $provide.decorator.should.have.been.calledWithExactly('$log', logConfig.logDecorator)
    })
  })
})
