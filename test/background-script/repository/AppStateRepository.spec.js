import AppStateRepository from '../../../src/background-script/repository/AppStateRepository'

describe('AppStateRepository', () => {
  const localStorageService = {
    get () {},
    set () {}
  }
  const STORE_STATE_KEY = 'store state key'
  const LANG_KEY = 'lang key'

  let appStateRepository

  beforeEach(() => {
    appStateRepository = new AppStateRepository(localStorageService, STORE_STATE_KEY, LANG_KEY)
  })

  beforeEach(() => {
    sinon.stub(localStorageService, 'get')
    sinon.stub(localStorageService, 'set')
  })

  afterEach(() => {
    localStorageService.get.restore()
    localStorageService.set.restore()
  })

  describe('getStoreState', () => {
    const storeState = {}

    beforeEach(() => {
      localStorageService.get.resolves({[STORE_STATE_KEY]: storeState})
    })

    it('should get value from local storage service by store state key', async () => {
      await appStateRepository.getStoreState()

      localStorageService.get.should.have.been.calledWithExactly(STORE_STATE_KEY)
    })

    it('should return store state', async () => {
      const state = await appStateRepository.getStoreState()

      expect(state).to.equal(storeState)
    })
  })

  describe('getOrDefaultStoreState', () => {
    const defaultStoreState = {
      foo: 'bar'
    }
    const storeState = {}

    beforeEach(() => {
      localStorageService.get.resolves({[STORE_STATE_KEY]: storeState})
    })

    it('should get value from local storage service by store state key and default value', async () => {
      await appStateRepository.getOrDefaultStoreState(defaultStoreState)

      localStorageService.get.should.have.been.calledWithExactly({[STORE_STATE_KEY]: defaultStoreState})
    })

    it('should return store state', async () => {
      const state = await appStateRepository.getOrDefaultStoreState(defaultStoreState)

      expect(state).to.equal(storeState)
    })
  })

  describe('setStoreState', () => {
    const storeState = {}

    it('should set store state with local storage service', async () => {
      await appStateRepository.setStoreState(storeState)

      localStorageService.set.should.have.been.calledWithExactly({[STORE_STATE_KEY]: storeState})
    })
  })

  describe('getLocale', () => {
    const locale = 'locale'

    beforeEach(() => {
      localStorageService.get.resolves({[LANG_KEY]: locale})
    })

    it('should get value from local storage service by lang key', async () => {
      await appStateRepository.getLocale()

      localStorageService.get.should.have.been.calledWithExactly(LANG_KEY)
    })

    it('should return locale', async () => {
      const l = await appStateRepository.getLocale()

      expect(l).to.equal(locale)
    })
  })

  describe('getOrDefaultLocale', () => {
    const defaultLocale = 'default locale'
    const locale = 'locale'

    beforeEach(() => {
      localStorageService.get.resolves({[LANG_KEY]: locale})
    })

    it('should get value from local storage service by lang key and default value', async () => {
      await appStateRepository.getOrDefaultLocale(defaultLocale)

      localStorageService.get.should.have.been.calledWithExactly({[LANG_KEY]: defaultLocale})
    })

    it('should return store state', async () => {
      const state = await appStateRepository.getOrDefaultLocale(defaultLocale)

      expect(state).to.equal(locale)
    })
  })

  describe('setLocale', () => {
    const locale = 'locale'

    it('should set store state with local storage service', async () => {
      await appStateRepository.setLocale(locale)

      localStorageService.set.should.have.been.calledWithExactly({[LANG_KEY]: locale})
    })
  })
})
