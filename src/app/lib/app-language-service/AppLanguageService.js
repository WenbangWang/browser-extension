import logger from '../../logger'

/**
 * Centralized place to provide language information.
 *
 * @class
 */
export default class AppLanguageService {
  /**
   *
   * @param {I18nService} i18nService
   * @param {EPNExtensionConfig} config
   * @constructor
   */
  constructor (i18nService, config) {
    this.i18nService = i18nService
    this.locale = config.locale
    this.logger = logger.getInstance('AppLanguageService')
  }

  /**
   * Gets the default locale defined by {@link EPNExtensionConfig}.
   *
   * @returns {String}
   */
  getDefaultLocale () {
    return this.locale.default
  }

  /**
   * Gets all supported locales defined by {@link EPNExtensionConfig}.
   *
   * @returns {Array<String>} - A list of locales.
   */
  getAllSupportedLocales () {
    return [this.locale.default, ...this.locale.others]
  }

  /**
   * Gets the current locale for the application. The return value is based on the following rules:
   *
   * If the UI language is supported, then return the app self-recognized locale.
   * If the UI language is not in the supported list but the language code is supported, then return the app self-recognized locale.
   * Everything else, fallback to the default locale.
   *
   * @returns {String}
   */
  getCurrentLocale () {
    const uiLanguage = this.i18nService.getUILanguage()
    const map = this.getAllSupportedLocales().reduce((map, locale) => {
      const langCode = extractLangCode(locale)
      map[langCode] = locale
      map[locale] = locale
      return map
    }, {})

    this.logger.debug(`The current UI language is - ${uiLanguage}`)

    if (map[uiLanguage]) {
      return map[uiLanguage]
    }

    const langCode = extractLangCode(uiLanguage)

    if (map[langCode]) {
      return map[langCode]
    }

    this.logger.warn(`The current UI language - ${uiLanguage} - is not supported by the app. So fallback to the default locale.`)

    return this.getDefaultLocale()
  }
}

function extractLangCode (locale) {
  return locale.split('-')[0]
}
