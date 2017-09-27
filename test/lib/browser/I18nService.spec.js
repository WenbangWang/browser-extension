import I18nService from '../../../src/lib/browser/I18nService'
import browser from '../../../src/browser-api-mock'

describe('I18nService', () => {
  let i18nService

  beforeEach(() => {
    i18nService = new I18nService(browser)
  })

  beforeEach(() => {
    sinon.stub(browser.i18n, 'getUILanguage')
  })

  afterEach(() => {
    browser.i18n.getUILanguage.restore()
  })

  describe('getUILanguage', () => {
    it('should get current ui language from browser i18n api', () => {
      const lang = 'en'
      browser.i18n.getUILanguage.returns(lang)

      expect(i18nService.getUILanguage()).to.equal(lang)
      browser.i18n.getUILanguage.should.have.been.called // eslint-disable-line no-unused-expressions
    })
  })
})
