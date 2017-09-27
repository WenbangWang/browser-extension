import wrapper from '../../../src/background-script/app-state-repository-handler/wrapper'

describe('app state repository handler wrapper', () => {
  const appStateRepository = {
    getOrDefaultLocale () {},
    getOrDefaultStoreState () {},
    setLocale () {},
    setStoreState () {}
  }
  const sender = {}

  let sendResponse
  let wrappedRepository

  beforeEach(() => {
    wrappedRepository = wrapper(appStateRepository)
  })

  beforeEach(() => {
    sendResponse = sinon.spy()

    Object.keys(appStateRepository).forEach(method => sinon.stub(appStateRepository, method))
  })

  afterEach(() => {
    Object.keys(appStateRepository).forEach(method => appStateRepository[method].restore())
  })

  describe('getOrDefaultLocale', () => {
    it('should call getOrDefaultLocale on repository with locale and call the callback', () => {
      const locale = 'locale'
      const defaultLocale = 'default locale'
      appStateRepository.getOrDefaultLocale.resolves(defaultLocale)

      return wrappedRepository.getOrDefaultLocale({data: {locale}}, sender, sendResponse)
        .then(() => {
          appStateRepository.getOrDefaultLocale.should.have.been.calledWithExactly(locale)
          sendResponse.should.have.been.calledWithExactly(defaultLocale)
        })
    })
  })

  describe('getOrDefaultStoreState', () => {
    it('should call getOrDefaultLocale on repository with locale and call the callback', () => {
      const storeState = 'locale'
      const defaultStoreState = 'default storeState'
      appStateRepository.getOrDefaultStoreState.resolves(defaultStoreState)

      return wrappedRepository.getOrDefaultStoreState({data: {storeState}}, sender, sendResponse)
        .then(() => {
          appStateRepository.getOrDefaultStoreState.should.have.been.calledWithExactly(storeState)
          sendResponse.should.have.been.calledWithExactly(defaultStoreState)
        })
    })
  })

  describe('setLocale', () => {
    it('should call setLocale on repository with locale', () => {
      const locale = 'locale'

      wrappedRepository.setLocale({data: {locale}})

      appStateRepository.setLocale.should.have.been.calledWithExactly(locale)
    })
  })

  describe('setStoreState', () => {
    it('should call setLocale on repository with locale', () => {
      const storeState = 'store state'

      wrappedRepository.setStoreState({data: {storeState}})

      appStateRepository.setStoreState.should.have.been.calledWithExactly(storeState)
    })
  })
})
