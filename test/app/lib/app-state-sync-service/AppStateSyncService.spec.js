import AppStateSyncService from '../../../../src/app/lib/app-state-sync-service/AppStateSyncService'

describe('AppStateSyncService', () => {
  const runtimeMessagingClient = {
    post () {},
    postSync () {}
  }
  const appLanguageService = {
    getCurrentLocale () {}
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
  const AppStateCommand = {
    GET_OR_DEFAULT_STORE_STATE: 0,
    GET_OR_DEFAULT_LOCALE: 1,
    UPDATE_STORE_STATE: 2,
    UPDATE_LOCALE: 3
  }
  const APP_MODE = {
    WEB_APP: 'web app'
  }
  const currentLocale = 'en'

  let store
  let router
  let i18n

  let appStateSyncService

  beforeEach(() => {
    appStateSyncService = new AppStateSyncService(runtimeMessagingClient, appLanguageService, vuexRouterSync, config, window, AppStateCommand, APP_MODE)

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
    sinon.stub(runtimeMessagingClient, 'post')
    sinon.stub(runtimeMessagingClient, 'postSync')
    sinon.stub(appLanguageService, 'getCurrentLocale').returns(currentLocale)
    sinon.stub(vuexRouterSync, 'sync')

    sinon.stub(store, 'replaceState')
    sinon.stub(store, 'subscribe')
    sinon.stub(router, 'replace')
    sinon.stub(router, 'afterEach')
    sinon.stub(i18n.vm, '$watch')
  })

  afterEach(() => {
    runtimeMessagingClient.post.restore()
    runtimeMessagingClient.postSync.restore()
    appLanguageService.getCurrentLocale.restore()
    vuexRouterSync.sync.restore()
  })

  describe('constructor', () => {
    it('should get current locale from app language service to set default state', () => {
      appStateSyncService = new AppStateSyncService(runtimeMessagingClient, appLanguageService, vuexRouterSync, config, window, AppStateCommand, APP_MODE)

      appLanguageService.getCurrentLocale.should.have.been.called // eslint-disable-line no-unused-expressions
      expect(appStateSyncService.state.locale).to.equal(currentLocale)
    })
  })

  describe('init', () => {
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
      runtimeMessagingClient.post.withArgs(AppStateCommand.GET_OR_DEFAULT_STORE_STATE, {storeState: appStateSyncService.state.storeState}).returns(state.storeState)
      runtimeMessagingClient.post.withArgs(AppStateCommand.GET_OR_DEFAULT_LOCALE, {locale: appStateSyncService.state.locale}).returns(state.locale)
    })

    it('should get or default with store state and locale', async () => {
      await appStateSyncService.init(store, router, i18n)

      runtimeMessagingClient.post.should.have.been.calledWithExactly(AppStateCommand.GET_OR_DEFAULT_STORE_STATE, {storeState: appStateSyncService.state.storeState})
      runtimeMessagingClient.post.should.have.been.calledWithExactly(AppStateCommand.GET_OR_DEFAULT_LOCALE, {locale: appStateSyncService.state.locale})
    })

    it('should set store state with stored value', async () => {
      await appStateSyncService.init(store, router, i18n)

      store.replaceState.should.have.been.calledWithExactly(state.storeState)
    })

    it('should replace the current route with location hash when the APP_MODE is WEB_APP and location hash is not base', async () => {
      config.appMode = APP_MODE.WEB_APP
      window.location.hash = '#/route'

      await appStateSyncService.init(store, router, i18n)

      router.replace.should.have.been.calledWithExactly(window.location.hash.substring(1))
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

      router.replace.should.have.been.calledWithExactly(state.storeState.route.fullPath)
    })

    it('should set i18n language with stored value', async () => {
      await appStateSyncService.init(store, router, i18n)

      expect(i18n.locale).to.equal(state.locale)
    })

    it('should sync the store state with the router state', async () => {
      await appStateSyncService.init(store, router, i18n)

      vuexRouterSync.sync.should.have.been.calledWithExactly(store, router)
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

        runtimeMessagingClient.postSync.should.have.been.calledWithExactly(AppStateCommand.UPDATE_STORE_STATE, {storeState})
      })
    })

    describe('i18n vm watcher', () => {
      it('should watch i18n vm locale changes', async () => {
        await appStateSyncService.init(store, router, i18n)

        i18n.vm.$watch.should.have.been.calledWithExactly('locale', sinon.match.func)
      })

      it('should update locale with the changed locale', async () => {
        const locale = 'locale'
        i18n.vm.$watch.callsArgWith(1, locale)

        await appStateSyncService.init(store, router, i18n)

        runtimeMessagingClient.postSync.should.have.been.calledWithExactly(AppStateCommand.UPDATE_LOCALE, {locale})
      })
    })
  })
})
