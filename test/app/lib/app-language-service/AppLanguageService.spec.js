import AppLanguageService from '../../../../src/app/lib/app-language-service/AppLanguageService'

describe('AppLanguageService', () => {
  const i18nService = {
    getUILanguage () {}
  }
  const config = {
    locale: {
      default: 'en',
      others: ['de-DE', 'fr-FR']
    }
  }

  let appLanguageService

  beforeEach(() => {
    appLanguageService = new AppLanguageService(i18nService, config)
  })

  beforeEach(() => {
    sinon.stub(i18nService, 'getUILanguage').returns('en-US')
  })

  afterEach(() => {
    i18nService.getUILanguage.restore()
  })

  describe('getDefaultLocale', () => {
    it('should return the default locale from config', () => {
      expect(appLanguageService.getDefaultLocale()).to.equal(config.locale.default)
    })
  })

  describe('getAllSupportedLocales', () => {
    it('should return all supported localed from config', () => {
      expect(appLanguageService.getAllSupportedLocales()).to.eql([config.locale.default, ...config.locale.others])
    })
  })

  describe('getCurrentLocale', () => {
    const supportedLocales = ['en-US', 'de-DE']
    beforeEach(() => {
      sinon.stub(appLanguageService, 'getAllSupportedLocales').returns(supportedLocales)
    })

    it('should get the ui language from i18n service', () => {
      appLanguageService.getCurrentLocale()

      i18nService.getUILanguage.should.have.been.called // eslint-disable-line no-unused-expressions
    })

    it('should return ui language when it is supported', () => {
      i18nService.getUILanguage.returns(supportedLocales[0])

      expect(appLanguageService.getCurrentLocale()).to.equal(supportedLocales[0])
    })

    describe('ui language is not in supported locales', () => {
      it('should return full locale when ui language only has lang code', () => {
        const langCode = supportedLocales[0].split('-')[0]
        i18nService.getUILanguage.returns(langCode)

        expect(appLanguageService.getCurrentLocale()).to.equal(supportedLocales[0])
      })

      it('should return locale when ui language lang code is supported', () => {
        const spanish = 'es'
        i18nService.getUILanguage.returns('es-ES')
        appLanguageService.getAllSupportedLocales.returns(supportedLocales.concat([spanish]))

        expect(appLanguageService.getCurrentLocale()).to.equal(spanish)
      })

      it('should return default locale when it is not supported at all', () => {
        const defaultLocale = supportedLocales[0]
        sinon.stub(appLanguageService, 'getDefaultLocale').returns(defaultLocale)
        i18nService.getUILanguage.returns('fr-FR')

        expect(appLanguageService.getCurrentLocale()).to.equal(defaultLocale)
        appLanguageService.getDefaultLocale.should.have.been.called // eslint-disable-line no-unused-expressions
      })
    })
  })
})
