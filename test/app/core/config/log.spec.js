'use strict'

describe('log config', () => {
  const logConfig = require('../../../../src/app/core/config/log')
  const ErrorStackParser = require('error-stack-parser')
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

    sinon.stub(ErrorStackParser, 'parse')

    sinon.stub(logStorageService, 'add')
  })

  afterEach(() => {
    methods.forEach(method => $delegateStubs[method].restore())

    $injector.get.restore()

    ErrorStackParser.parse.restore()

    logStorageService.add.restore()
  })

  describe('decorator', () => {
    beforeEach(() => {
      logConfig.logDecorator($delegate, $injector)
    })

    it('should call the original method from $delegate', () => {
      const arg1 = 'arg1'
      const arg2 = 'arg2'

      methods.forEach(method => $delegate[method].call(null, arg1, arg2))

      methods.forEach(method => $delegateStubs[method].should.have.been.calledWithExactly(arg1, arg2))
    })

    it('should inject logStorageService from $injector', () => {
      methods.forEach(method => $delegate[method]())

      $injector.get.should.have.been.calledWithExactly('logStorageService')
      $injector.get.should.have.callCount(methods.length)
    })

    describe('first argument is an instance of Error', () => {
      const stacktrace = 'stacktrace'
      const error = new Error()

      beforeEach(() => {
        ErrorStackParser.parse.returns(stacktrace)
      })

      it('should parse error stack', () => {
        $delegate.error(error)

        ErrorStackParser.parse.should.have.been.calledWithExactly(error)
      })

      it('should add log body to log storage service with properties', () => {
        $delegate.error(error)

        const arg = logStorageService.add.args[0][0]

        expect(arg).to.have.property('type', 'error')
        expect(arg).to.have.property('message', error.message)
        expect(arg).to.have.property('stacktrace', stacktrace)
      })
    })

    it('should add log body to log storage service with properties', () => {
      const arg1 = 'arg1'
      const arg2 = 'arg2'
      const promises = []

      methods.forEach(method => $delegate[method].call(null, arg1, arg2))

      return Promise.all(promises).then(() => {
        methods.forEach((method, index) => {
          const args = logStorageService.add.args[index][0]

          expect(args).to.have.property('type', method)
          expect(args).to.have.property('message').that.is.an('array').that.eql([arg1, arg2])
        })
      })
    })

    describe('getInstance', () => {
      const context = 'context'

      let logger

      beforeEach(() => {
        logger = $delegate.getInstance(context)
      })

      it('should add extra field context to the log body', () => {
        const arg1 = 'arg1'
        const arg2 = 'arg2'
        const promises = []

        methods.forEach(method => logger[method].call(null, arg1, arg2))

        return Promise.all(promises).then(() => {
          methods.forEach((method, index) => {
            const args = logStorageService.add.args[index][0]

            expect(args).to.have.property('type', method)
            expect(args).to.have.property('message').that.is.an('array').that.eql([arg1, arg2])
            expect(args).to.have.property('context', context)
          })
        })
      })
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
