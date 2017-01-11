'use strict'

describe('LogStorageService', function () {
  const LogStorageService = require('../../../../src/app/core/service/LogStorageService')
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

  let $q
  let $http
  let $scope
  let logStorageService

  beforeEach(inject($injector => {
    $q = $injector.get('$q')
    $http = $injector.get('$http')
    $scope = $injector.get('$rootScope').$new()
  }))

  beforeEach(function () {
    sinon.stub(localStorageService, 'get')
    sinon.stub(localStorageService, 'set')
    sinon.stub($http, 'post')
  })

  beforeEach(function () {
    logStorageService = new LogStorageService(localStorageService, $q, $http)
  })

  afterEach(function () {
    localStorageService.get.restore()
    localStorageService.set.restore()
    $http.post.restore()
  })

  describe('getStorageSource', function () {
    describe('is flushing', function () {
      beforeEach(function () {
        logStorageService._isFlushing = true
      })

      it('should return a promise which resolves by the in-memory storage', function (done) {
        logStorageService.getStorageSource()
          .then(source => {
            expect(source).to.equal(logStorageService._storage)
          })
          .then(done, done)

        $scope.$apply()
      })
    })

    describe('is not flushing', function (done) {
      it('should get storage from localStorageService', function () {
        localStorageService.get.returns($q.resolve())

        logStorageService.getStorageSource()

        sinon.assert.called(localStorageService.get)
      })

      it('should return a promise which resolves by the in-memory storage when localStorageService.get is rejected', function (done) {
        localStorageService.get.returns($q.reject(123))

        logStorageService.getStorageSource()
          .then(source => {
            expect(source).to.equal(logStorageService._storage)
          })
          .then(done, done)

        $scope.$apply()
      })

      it('should return a promise which resolves by the storage source if the source exists in local storage', function () {
        const storage = {}
        storage[LOG_STORAGE_CONFIG.name] = []
        localStorageService.get.returns($q.resolve(storage))

        logStorageService.getStorageSource()
          .then(source => {
            expect(source).to.equal(storage[LOG_STORAGE_CONFIG.name])
          })
          .then(done, done)

        $scope.$apply()
      })

      describe('source does not exist', function () {
        beforeEach(function () {
          localStorageService.get.returns($q.resolve())
        })

        it('should create a new storage', function () {
          const storage = {}
          storage[LOG_STORAGE_CONFIG.name] = []
          localStorageService.set.returns($q.resolve())

          logStorageService.getStorageSource()
            .then(() => {
              sinon.assert.calledWithExactly(localStorageService.set, storage)
            })
            .then(done, done)

          $scope.$apply()
        })

        it('should return a promise which resolves by the new created storage', function () {
          const storage = {}
          storage[LOG_STORAGE_CONFIG.name] = []
          localStorageService.set.returns($q.resolve())

          logStorageService.getStorageSource()
            .then(source => {
              expect(source).to.eql(storage[LOG_STORAGE_CONFIG.name])
            })
            .then(done, done)

          $scope.$apply()
        })

        it('should return a promise which resolves by the in-memory storage when creation is failed', function () {
          localStorageService.set.returns($q.reject(123))

          logStorageService.getStorageSource()
            .then(source => {
              expect(source).to.equal(logStorageService._storage)
            })
            .then(done, done)

          $scope.$apply()
        })
      })
    })
  })

  describe('size', function () {
    beforeEach(function () {
      sinon.stub(logStorageService, 'getStorageSource')
    })

    it('should call getStorageSource', function () {
      logStorageService.getStorageSource.returns($q.resolve())

      logStorageService.size()

      sinon.assert.called(logStorageService.getStorageSource)
    })

    it('should return a promise which resolves by the length of storage', function (done) {
      const storage = [1, 2, 3]
      logStorageService.getStorageSource.returns($q.resolve(storage))

      logStorageService.size()
        .then(size => {
          expect(size).to.equal(storage.length)
        })
        .then(done, done)

      $scope.$apply()
    })

    it('should return a promise which resolves by 0 if storage does not have length', function (done) {
      logStorageService.getStorageSource.returns($q.resolve())

      logStorageService.size()
        .then(size => {
          expect(size).to.equal(0)
        })
        .then(done, done)

      $scope.$apply()
    })
  })

  describe('isEmpty', function () {
    beforeEach(function () {
      sinon.stub(logStorageService, 'size')
    })

    it('should call size', function () {
      logStorageService.size.returns($q.resolve())

      logStorageService.isEmpty()

      sinon.assert.called(logStorageService.size)
    })

    it('should return a promise which resolves by true if the size is 0', function (done) {
      logStorageService.size.returns($q.resolve(0))

      logStorageService.isEmpty()
        .then(isEmpty => {
          expect(isEmpty).to.be.true
        })
        .then(done, done)

      $scope.$apply()
    })

    it('should return a promise which resolves by false if the size is not 0', function (done) {
      logStorageService.size.returns($q.resolve(1))

      logStorageService.isEmpty()
        .then(isEmpty => {
          expect(isEmpty).to.be.false
        })
        .then(done, done)

      $scope.$apply()
    })
  })

  describe('isFlushing', function () {
    it('should return false by default', function () {
      expect(logStorageService.isFlushing()).to.be.false
    })

    it('should return true when set', function () {
      logStorageService._isFlushing = true

      expect(logStorageService.isFlushing()).to.be.true
    })
  })

  describe('add', function () {
    beforeEach(function () {
      sinon.stub(logStorageService, 'getStorageSource')
    })

    it('should call getStorageSource', function () {
      logStorageService.getStorageSource.returns($q.resolve())

      logStorageService.add({})

      sinon.assert.called(logStorageService.getStorageSource)
    })

    it('should add log to storage source', function (done) {
      const source = []
      const log = {}
      logStorageService.getStorageSource.returns($q.resolve(source))
      localStorageService.set.returns($q.resolve())

      logStorageService.add(log)
        .then(() => {
          expect(log).to.be.oneOf(source)
        })
        .then(done, done)

      $scope.$apply()
    })

    describe('is not flushing', function () {
      it('should add log to the storage', function (done) {
        const storage = {}
        const source = []
        const log = {}
        storage[LOG_STORAGE_CONFIG.name] = source.concat([log])
        logStorageService.getStorageSource.returns($q.resolve(source))
        localStorageService.set.returns($q.resolve())

        logStorageService.add(log)
          .then(() => {
            sinon.assert.calledWithExactly(localStorageService.set, storage)
          })
          .then(done, done)

        $scope.$apply()
      })

      it('should return a promise which resolves when adding log is succeeded', function (done) {
        logStorageService.getStorageSource.returns($q.resolve([]))
        localStorageService.set.returns($q.resolve())

        logStorageService.add({})
          .then(() => {
            expect(true).to.be.true
          })
          .then(done, done)

        $scope.$apply()
      })

      describe('add log failed', function () {
        beforeEach(function () {
          localStorageService.set.returns($q.reject(123))
        })

        it('should add log to in-memory storage when and the current storage source is not in-memory storage', function (done) {
          const storage = []
          const log = {}
          logStorageService.getStorageSource.returns($q.resolve(storage))

          logStorageService.add(log)
            .then(() => {
              expect(log).to.be.oneOf(logStorageService._storage)
            })
            .then(done, done)

          $scope.$apply()
        })

        it('should return a promise which resolves with nothing when current storage is in-memory storage', function (done) {
          const log = {}
          logStorageService.getStorageSource.returns($q.resolve(logStorageService._storage))

          logStorageService.add(log)
            .then(() => {
              expect(log).to.be.oneOf(logStorageService._storage)
            })
            .then(done, done)

          $scope.$apply()
        })
      })
    })

    describe('is flushing', function () {
      beforeEach(function () {
        logStorageService._isFlushing = true
      })

      it('should return a promise which resolves with nothing and not calling localStorageService.set', function (done) {
        logStorageService.getStorageSource.returns($q.resolve([]))

        logStorageService.add()
          .then(() => {
            sinon.assert.notCalled(localStorageService.set)
          })
          .then(done, done)

        $scope.$apply()
      })
    })
  })

  describe('clear', function () {
    it('should clear the in-memory storage', function () {
      logStorageService._storage.push(123)

      logStorageService.clear()

      expect(logStorageService._storage).to.be.empty
    })

    it('should clear the local storage', function () {
      const storage = {}
      storage[LOG_STORAGE_CONFIG.name] = []

      logStorageService.clear()

      sinon.assert.calledWithExactly(localStorageService.set, storage)
    })
  })

  describe('flush', function () {
    beforeEach(function () {
      sinon.stub(logStorageService, 'getStorageSource')
    })

    describe('is flushing', function () {
      it('should do nothing when the storage is flushing', function (done) {
        logStorageService._isFlushing = true

        logStorageService.flush()
          .then(() => {
            expect(true).to.be.true
            sinon.assert.notCalled(logStorageService.getStorageSource)
          })
          .then(done, done)

        $scope.$apply()
      })
    })

    describe('is not flushing', function () {
      let deferred

      beforeEach(function () {
        deferred = $q.defer()
        logStorageService.getStorageSource.returns(deferred.promise)
      })

      it('should set isFlushing to true', function () {
        logStorageService.flush()

        expect(logStorageService.isFlushing()).to.be.true
      })

      it('should get the storage source', function () {
        logStorageService.flush()

        sinon.assert.called(logStorageService.getStorageSource)
      })

      it('should post storage source', function (done) {
        const source = []
        deferred.resolve(source)
        $http.post.returns($q.resolve())

        logStorageService.flush()
          .then(() => {
            sinon.assert.calledWithExactly($http.post, `${BASE_URL}/log`, source)
          })
          .then(done, done)

        $scope.$apply()
      })

      it(`should try to post storage source ${LOG_STORAGE_CONFIG.retry} times until it rejects the promise`, function (done) {
        deferred.resolve([])
        $http.post.returns($q.reject(123))

        logStorageService.flush()
          .catch(() => {
            sinon.assert.callCount(logStorageService.getStorageSource, LOG_STORAGE_CONFIG.retry)
            sinon.assert.callCount($http.post, LOG_STORAGE_CONFIG.retry)
          })
          .then(done, done)

        $scope.$apply()
      })

      it(`should return a promise which resolves after post storage source fails less than ${LOG_STORAGE_CONFIG.retry} times`, function (done) {
        deferred.resolve([])
        for (let i = 0; i < LOG_STORAGE_CONFIG.retry - 1; i++) {
          $http.post.onCall(i).returns($q.reject(123))
        }
        $http.post.onCall(LOG_STORAGE_CONFIG.retry - 1).returns($q.resolve())

        logStorageService.flush()
          .then(() => {
            sinon.assert.callCount(logStorageService.getStorageSource, LOG_STORAGE_CONFIG.retry)
            sinon.assert.callCount($http.post, LOG_STORAGE_CONFIG.retry)
          })
          .then(done, done)

        $scope.$apply()
      })

      it(`should reject the promise returned when post storage source fails less than ${LOG_STORAGE_CONFIG.retry} times but the size of the source exceeds ${LOG_STORAGE_CONFIG.threshold}`, function (done) {
        const largeStorageSource = []
        largeStorageSource.length = LOG_STORAGE_CONFIG.threshold + 1
        $http.post.onFirstCall().returns($q.reject(123))
        deferred.resolve(largeStorageSource)

        logStorageService.flush()
          .catch(() => {
            sinon.assert.calledOnce(logStorageService.getStorageSource)
            sinon.assert.calledOnce($http.post)
          })
          .then(done, done)

        $scope.$apply()
      })

      describe('log posting success', function () {
        beforeEach(function () {
          deferred.resolve([])
          $http.post.returns($q.resolve())
        })

        it('should stop flushing', function (done) {
          logStorageService.flush()
            .then(() => {
              expect(logStorageService.isFlushing()).to.be.false
            })
            .then(done, done)

          $scope.$apply()
        })

        it('should replace the local storage with the in-memory storage', function (done) {
          const storage = {}
          logStorageService._storage = [1, 2, 3]
          storage[LOG_STORAGE_CONFIG.name] = logStorageService._storage

          logStorageService.flush()
            .then(() => {
              sinon.assert.calledWithExactly(localStorageService.set, storage)
            })
            .then(done, done)

          $scope.$apply()
        })

        it('should clear the in-memory storage when localStorageService.set is resolved', function (done) {
          logStorageService._storage = [1, 2, 3]
          localStorageService.set.returns($q.resolve())

          logStorageService.flush()
            .then(() => {
              expect(logStorageService._storage).to.be.empty
            })
            .then(done, done)

          $scope.$apply()
        })
      })

      it('should stop flushing when post log is failed', function (done) {
        deferred.resolve([])
        $http.post.returns($q.reject(123))

        logStorageService.flush()
          .catch(() => {
            expect(logStorageService.isFlushing()).to.be.false
          })
          .then(done, done)

        $scope.$apply()
      })

      it('should stop flushing when localStorageService.set is failed', function (done) {
        deferred.resolve([])
        $http.post.returns($q.resolve())
        localStorageService.set.returns($q.reject(123))

        logStorageService.flush()
          .catch(() => {
            expect(logStorageService.isFlushing()).to.be.false
          })
          .then(done, done)

        $scope.$apply()
      })
    })
  })
})
