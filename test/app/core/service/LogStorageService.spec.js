'use strict'

describe('LogStorageService', () => {
  const LogStorageService = require('../../../../src/app/core/service/LogStorageService')
  const $qBluebirdPolyfill = require('../../../helper/$q-bluebird-polyfill')
  const LOG_STORAGE_CONFIG = {
    name: 'log',
    batchSize: 64,
    threshold: 5120,
    retry: 3
  }
  const BASE_URL = 'http://localhost:9090'
  const localStorageService = {
    get: () => {},
    set: () => {}
  }
  const $http = {
    post: () => {}
  }

  let $q
  let logStorageService

  beforeEach(() => {
    sinon.stub(localStorageService, 'get')
    sinon.stub(localStorageService, 'set')
    sinon.stub($http, 'post')
  })

  beforeEach(() => {
    $q = $qBluebirdPolyfill()
    logStorageService = new LogStorageService(localStorageService, $q, $http)
  })

  afterEach(() => {
    localStorageService.get.restore()
    localStorageService.set.restore()
    $http.post.restore()
  })

  describe('getStorageSource', () => {
    describe('is flushing', () => {
      beforeEach(() => {
        logStorageService._isFlushing = true
      })

      it('should return a promise which resolves by the in-memory storage', () => {
        return logStorageService.getStorageSource()
          .then(source => expect(source).to.equal(logStorageService._storage))
      })
    })

    describe('is not flushing', () => {
      const source = []

      beforeEach(() => {
        sinon.stub(logStorageService, 'getStorageSourceFromLocalStorage').returns($q.resolve(source))
      })

      it('should get storage source from local storage', () => {
        return logStorageService.getStorageSource()
          .then(s => {
            expect(s).to.equal(source)
            logStorageService.getStorageSourceFromLocalStorage.should.have.been.called
          })
      })
    })
  })

  describe('getStorageSourceFromLocalStorage', () => {
    it('should get storage from localStorageService', () => {
      const promise = $q.resolve()
      localStorageService.get.returns(promise)

      logStorageService.getStorageSourceFromLocalStorage()

      return promise
        .then(() => localStorageService.get.should.have.been.called)
    })

    it('should return a promise which resolves by the in-memory storage when localStorageService.get is rejected', () => {
      localStorageService.get.returns($q.reject(new Error()))

      return logStorageService.getStorageSourceFromLocalStorage()
        .then(source => expect(source).to.equal(logStorageService._storage))
    })

    it('should return a promise which resolves by the storage source if the source exists in local storage', () => {
      const storage = {}
      storage[LOG_STORAGE_CONFIG.name] = []
      localStorageService.get.returns($q.resolve(storage))

      return logStorageService.getStorageSourceFromLocalStorage()
        .then(source => expect(source).to.equal(storage[LOG_STORAGE_CONFIG.name]))
    })

    describe('source does not exist', () => {
      beforeEach(() => {
        localStorageService.get.returns($q.resolve())
      })

      it('should create a new storage', () => {
        const storage = {}
        storage[LOG_STORAGE_CONFIG.name] = []
        localStorageService.set.returns($q.resolve())

        return logStorageService.getStorageSourceFromLocalStorage()
          .then(() => localStorageService.set.should.have.been.calledWithExactly(storage))
      })

      it('should return a promise which resolves by the new created storage', () => {
        const storage = {}
        storage[LOG_STORAGE_CONFIG.name] = []
        localStorageService.set.returns($q.resolve())

        return logStorageService.getStorageSourceFromLocalStorage()
          .then(source => expect(source).to.eql(storage[LOG_STORAGE_CONFIG.name]))
      })

      it('should return a promise which resolves by the in-memory storage when creation is failed', () => {
        localStorageService.set.returns($q.reject(new Error()))

        return logStorageService.getStorageSourceFromLocalStorage()
          .then(source => expect(source).to.equal(logStorageService._storage))
      })
    })
  })

  describe('size', () => {
    beforeEach(() => {
      sinon.stub(logStorageService, 'getStorageSource')
    })

    it('should call getStorageSource', () => {
      const promise = $q.resolve()
      logStorageService.getStorageSource.returns(promise)

      logStorageService.size()

      return promise.then(() => logStorageService.getStorageSource.should.have.been.called)
    })

    it('should return a promise which resolves by the length of storage', () => {
      const storage = [1, 2, 3]
      logStorageService.getStorageSource.returns($q.resolve(storage))

      return logStorageService.size()
        .then(size => expect(size).to.equal(storage.length))
    })

    it('should return a promise which resolves by 0 if storage does not have length', () => {
      logStorageService.getStorageSource.returns($q.resolve())

      return logStorageService.size()
        .then(size => expect(size).to.equal(0))
    })
  })

  describe('isEmpty', () => {
    beforeEach(() => {
      sinon.stub(logStorageService, 'size')
    })

    it('should call size', () => {
      const promise = $q.resolve()
      logStorageService.size.returns(promise)

      logStorageService.isEmpty()

      return promise.then(() => logStorageService.size.should.have.been.called)
    })

    it('should return a promise which resolves by true if the size is 0', () => {
      logStorageService.size.returns($q.resolve(0))

      return logStorageService.isEmpty()
        .then(isEmpty => expect(isEmpty).to.be.true)
    })

    it('should return a promise which resolves by false if the size is not 0', () => {
      logStorageService.size.returns($q.resolve(1))

      return logStorageService.isEmpty()
        .then(isEmpty => expect(isEmpty).to.be.false)
    })
  })

  describe('isFlushing', () => {
    it('should return false by default', () => {
      expect(logStorageService.isFlushing()).to.be.false
    })

    it('should return true when set', () => {
      logStorageService._isFlushing = true

      expect(logStorageService.isFlushing()).to.be.true
    })
  })

  describe('add', () => {
    beforeEach(() => {
      sinon.stub(logStorageService, 'getStorageSource')
    })

    it('should call getStorageSource', () => {
      const promise = $q.resolve()
      logStorageService.getStorageSource.returns(promise)

      logStorageService.add({})

      promise.then(() => logStorageService.getStorageSource.should.have.been.called)
    })

    it('should add log to storage source', () => {
      const source = []
      const log = {}
      logStorageService.getStorageSource.returns($q.resolve(source))
      localStorageService.set.returns($q.resolve())

      logStorageService.add(log)
        .then(() => expect(log).to.be.oneOf(source))
    })

    describe('is not flushing', () => {
      it('should add log to the storage', () => {
        const storage = {}
        const source = []
        const log = {}
        storage[LOG_STORAGE_CONFIG.name] = source.concat([log])
        logStorageService.getStorageSource.returns($q.resolve(source))
        localStorageService.set.returns($q.resolve())

        logStorageService.add(log)
          .then(() => localStorageService.set.should.have.been.calledWithExactly(storage))
      })

      it('should return a promise which resolves when adding log is succeeded', () => {
        logStorageService.getStorageSource.returns($q.resolve([]))
        localStorageService.set.returns($q.resolve())

        return logStorageService.add({})
          .then(() => expect(true).to.be.true)
      })

      describe('add log failed', () => {
        beforeEach(() => {
          localStorageService.set.returns($q.reject(new Error()))
        })

        it('should add log to in-memory storage when and the current storage source is not in-memory storage', () => {
          const storage = []
          const log = {}
          logStorageService.getStorageSource.returns($q.resolve(storage))

          return logStorageService.add(log)
            .then(() => expect(log).to.be.oneOf(logStorageService._storage))
        })

        it('should return a promise which resolves with nothing when current storage is in-memory storage', () => {
          const log = {}
          logStorageService.getStorageSource.returns($q.resolve(logStorageService._storage))

          return logStorageService.add(log)
            .then(() => expect(log).to.be.oneOf(logStorageService._storage))
        })
      })
    })

    describe('is flushing', () => {
      beforeEach(() => {
        logStorageService._isFlushing = true
      })

      it('should return a promise which resolves with nothing and not calling localStorageService.set', () => {
        logStorageService.getStorageSource.returns($q.resolve([]))

        return logStorageService.add()
          .then(() => localStorageService.set.should.not.have.been.called)
      })
    })
  })

  describe('clear', () => {
    it('should clear the in-memory storage', () => {
      localStorageService.set.returns($q.resolve())

      logStorageService._storage.push(123)

      return logStorageService.clear()
        .then(() => expect(logStorageService._storage).to.be.empty)
    })

    it('should clear the local storage', () => {
      const storage = {}
      localStorageService.set.returns($q.resolve())
      storage[LOG_STORAGE_CONFIG.name] = []

      return logStorageService.clear()
        .then(() => localStorageService.set.should.have.been.calledWithExactly(storage))
    })
  })

  describe('flush', () => {
    beforeEach(() => {
      sinon.stub(logStorageService, 'getStorageSourceFromLocalStorage')
    })

    describe('is flushing', () => {
      it('should do nothing when the storage is flushing', () => {
        logStorageService._isFlushing = true

        return logStorageService.flush()
          .then(() => {
            expect(true).to.be.true
            logStorageService.getStorageSourceFromLocalStorage.should.not.have.been.called
          })
      })
    })

    describe('is not flushing', () => {
      let deferred

      beforeEach(() => {
        deferred = $q.defer()
        logStorageService.getStorageSourceFromLocalStorage.returns(deferred.promise)
      })

      it('should set isFlushing to true', () => {
        logStorageService.flush()

        expect(logStorageService.isFlushing()).to.be.true
      })

      it('should get the storage source', () => {
        logStorageService.flush()

        logStorageService.getStorageSourceFromLocalStorage.should.have.been.called
      })

      it('should post storage source', () => {
        const source = []
        deferred.resolve(source)
        $http.post.returns($q.resolve())

        return logStorageService.flush()
          .then(() => $http.post.should.have.been.calledWithExactly(`${BASE_URL}/log`, source))
      })

      it(`should try to post storage source ${LOG_STORAGE_CONFIG.retry} times until it rejects the promise`, () => {
        deferred.resolve([])
        $http.post.returns($q.reject(new Error()))

        return logStorageService.flush()
          .catch(error => {
            expect(error).to.be.an.instanceof(Error)
            logStorageService.getStorageSourceFromLocalStorage.should.have.callCount(LOG_STORAGE_CONFIG.retry)
            $http.post.should.have.callCount(LOG_STORAGE_CONFIG.retry)
          })
      })

      it(`should return a promise which resolves after post storage source fails less than ${LOG_STORAGE_CONFIG.retry} times`, () => {
        deferred.resolve([])
        for (let i = 0; i < LOG_STORAGE_CONFIG.retry - 1; i++) {
          $http.post.onCall(i).returns($q.reject(new Error()))
        }
        $http.post.onCall(LOG_STORAGE_CONFIG.retry - 1).returns($q.resolve())

        return logStorageService.flush()
          .then(() => {
            logStorageService.getStorageSourceFromLocalStorage.should.have.callCount(LOG_STORAGE_CONFIG.retry)
            $http.post.should.have.callCount(LOG_STORAGE_CONFIG.retry)
          })
      })

      it(`should reject the promise returned when post storage source fails less than ${LOG_STORAGE_CONFIG.retry} times but the size of the source exceeds ${LOG_STORAGE_CONFIG.threshold}`, () => {
        const largeStorageSource = []
        largeStorageSource.length = LOG_STORAGE_CONFIG.threshold + 1
        $http.post.onFirstCall().returns($q.reject(new Error()))
        deferred.resolve(largeStorageSource)

        return logStorageService.flush()
          .catch(() => {
            logStorageService.getStorageSourceFromLocalStorage.should.have.been.calledOnce
            $http.post.should.have.been.calledOnce
          })
      })

      describe('log posting success', () => {
        beforeEach(() => {
          deferred.resolve([])
          $http.post.returns($q.resolve())
        })

        it('should stop flushing', () => {
          return logStorageService.flush()
            .then(() => expect(logStorageService.isFlushing()).to.be.false)
        })

        it('should replace the local storage with the in-memory storage', () => {
          const storage = {}
          logStorageService._storage = [1, 2, 3]
          storage[LOG_STORAGE_CONFIG.name] = logStorageService._storage

          return logStorageService.flush()
            .then(() => localStorageService.set.should.have.been.calledWithExactly(storage))
        })

        it('should clear the in-memory storage when localStorageService.set is resolved', () => {
          logStorageService._storage = [1, 2, 3]
          localStorageService.set.returns($q.resolve())

          return logStorageService.flush()
            .then(() => expect(logStorageService._storage).to.be.empty)
        })
      })

      it('should stop flushing when post log is failed', () => {
        deferred.resolve([])
        $http.post.returns($q.reject(new Error()))

        return logStorageService.flush()
          .catch(() => expect(logStorageService.isFlushing()).to.be.false)
      })

      it('should stop flushing when localStorageService.set is failed', () => {
        deferred.resolve([])
        $http.post.returns($q.resolve())
        localStorageService.set.returns($q.reject(new Error()))

        return logStorageService.flush()
          .catch(() => expect(logStorageService.isFlushing()).to.be.false)
      })
    })
  })
})
