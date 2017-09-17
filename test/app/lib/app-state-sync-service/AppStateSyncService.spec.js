import AppStateSyncService from '../../../../src/app/lib/app-state-sync-service/AppStateSyncService'

describe('AppStateSyncService', () => {
  const localStorageService = {
    get () {},
    set () {}
  }
  const vuexRouterSync = {
    sync () {}
  }
  const config = {
    appMode: 'app mode'
  }
  const window = {
    location: {
      hash: ''
    }
  }
  const APP_STATE_KEY = 'key'
  const APP_MODE = {
    WEB_APP: 'web app'
  }

  let store
  let router
  let i18n

  let appStateSyncService

  beforeEach(() => {
    appStateSyncService = new AppStateSyncService(localStorageService, vuexRouterSync, config, window, APP_STATE_KEY, APP_MODE)

    store = {
      replaceState () {},
      subscribe () {}
    }
    router = {
      replace () {},
      afterEach () {}
    }
    i18n = {
      locale: '',
      vm: {
        $watch () {}
      }
    }
  })

  beforeEach(() => {
    sinon.stub(localStorageService, 'get')
    sinon.stub(localStorageService, 'set')
    sinon.stub(vuexRouterSync, 'sync')

    sinon.stub(store, 'replaceState')
    sinon.stub(store, 'subscribe')
    sinon.stub(router, 'replace')
    sinon.stub(router, 'afterEach')
    sinon.stub(i18n.vm, '$watch')
  })

  afterEach(() => {
    localStorageService.get.restore()
    localStorageService.set.restore()
    vuexRouterSync.sync.restore()
  })

  describe('init', () => {
    it('should retrieve storage from localStorageService', async () => {
      await appStateSyncService.init(store, router, i18n)

      localStorageService.get.should.have.been.calledWithExactly(APP_STATE_KEY)
    })

    it('should replace the current route with location hash when the APP_MODE is WEB_APP and location hash is not base', async () => {
      config.appMode = APP_MODE.WEB_APP
      window.location.hash = '#/route'

      await appStateSyncService.init(store, router, i18n)

      router.replace.should.have.been.calledWithExactly(window.location.hash.substring(1))
    })

    describe('no init state', () => {
      beforeEach(() => {
        localStorageService.get.resolves()
      })

      it('should set store state with default value', async () => {
        await appStateSyncService.init(store, router, i18n)

        store.replaceState.should.have.been.calledWithExactly(appStateSyncService.state.storeState)
      })

      it('should set i18n language with default value', async () => {
        await appStateSyncService.init(store, router, i18n)

        expect(i18n.locale).to.equal(appStateSyncService.state.locale)
      })

      it('should replace the current route with default value when APP_MODE is not WEB_APP', async () => {
        config.appMode = ''
        window.location.hash = '#/'

        await appStateSyncService.init(store, router, i18n)

        router.replace.should.have.been.calledWithExactly(appStateSyncService.state.storeState.route.fullPath)
      })

      it('should replace the current route with default value when APP_MODE is WEB_APP and location hash is on base', async () => {
        const originFullPath = appStateSyncService.state.storeState.route.fullPath
        appStateSyncService.state.storeState.route.fullPath = '/route'
        config.appMode = APP_MODE.WEB_APP
        window.location.hash = '#/'

        await appStateSyncService.init(store, router, i18n)

        router.replace.should.have.been.calledWithExactly(appStateSyncService.state.storeState.route.fullPath)

        appStateSyncService.state.storeState.route.fullPath = originFullPath
      })
    })

    describe('found state from storage', () => {
      const state = {
        storeState: {
          foo: 1,
          route: {
            fullPath: '/bar'
          }
        },
        locale: 'de-DE'
      }

      beforeEach(() => {
        localStorageService.get.resolves({[APP_STATE_KEY]: state})
      })

      it('should set store state with stored value', async () => {
        await appStateSyncService.init(store, router, i18n)

        store.replaceState.should.have.been.calledWithExactly(state.storeState)
      })

      it('should set i18n language with stored value', async () => {
        await appStateSyncService.init(store, router, i18n)

        expect(i18n.locale).to.equal(state.locale)
      })

      it('should replace the current route with stored value when APP_MODE is not WEB_APP', async () => {
        config.appMode = ''
        window.location.hash = '#/'

        await appStateSyncService.init(store, router, i18n)

        router.replace.should.have.been.calledWithExactly(state.storeState.route.fullPath)
      })

      it('should replace the current route with stored value when APP_MODE is WEB_APP and location hash is on base', async () => {
        config.appMode = APP_MODE.WEB_APP
        window.location.hash = '#/'

        await appStateSyncService.init(store, router, i18n)

        router.replace.should.have.been.calledWithExactly(appStateSyncService.state.storeState.route.fullPath)
      })
    })

    describe('store subscription', () => {
      it('should add a subscribe listener to the store', async () => {
        await appStateSyncService.init(store, router, i18n)

        store.subscribe.should.have.been.calledWithExactly(sinon.match.func)
      })

      it('should update the store state when the listener is called', async () => {
        const storeState = {}
        store.subscribe.callsArgWith(0, null, storeState)
        sinon.stub(appStateSyncService, 'updateStoreState')

        await appStateSyncService.init(store, router, i18n)

        appStateSyncService.updateStoreState.should.have.been.calledWithExactly(storeState)
      })
    })

    it('should sync the store state with the router state', async () => {
      await appStateSyncService.init(store, router, i18n)

      vuexRouterSync.sync.should.have.been.calledWithExactly(store, router)
    })

    describe('i18n vm watcher', () => {
      beforeEach(() => {
        sinon.stub(appStateSyncService, 'updateLocale')
      })

      it('should watch i18n vm locale changes', async () => {
        await appStateSyncService.init(store, router, i18n)

        i18n.vm.$watch.should.have.been.calledWithExactly('locale', sinon.match.func)
      })

      it('should update locale with the changed locale', async () => {
        const locale = 'locale'
        i18n.vm.$watch.callsArgWith(1, locale)

        await appStateSyncService.init(store, router, i18n)

        appStateSyncService.updateLocale.should.have.been.calledWithExactly(locale)
      })
    })
  })

  describe('updateStoreState', () => {
    it('should update the internal storeState', async () => {
      const storeState = {}

      await appStateSyncService.updateStoreState(storeState)

      expect(appStateSyncService.state.storeState).to.equal(storeState)
    })

    it('should save the current state into local storage', async () => {
      await appStateSyncService.updateStoreState()

      localStorageService.set.should.have.been.calledWithExactly({[APP_STATE_KEY]: appStateSyncService.state})
    })
  })

  describe('updateLocale', () => {
    it('should update the internal storeState', async () => {
      const locale = 'de-DE'

      await appStateSyncService.updateLocale(locale)

      expect(appStateSyncService.state.locale).to.equal(locale)
    })

    it('should save the current state into local storage', async () => {
      await appStateSyncService.updateLocale()

      localStorageService.set.should.have.been.calledWithExactly({[APP_STATE_KEY]: appStateSyncService.state})
    })
  })
})
