/**
 * A wrapper around browser.i18n
 *
 * @class
 */
export default class I18nService {
  constructor (browser) {
    this.browser = browser
  }

  /**
   * Get the current language used by browser UI.
   *
   * @returns {String} - This can be a full locale such as "en-US" or only a language code such as "en".
   */
  getUILanguage () {
    return this.browser.i18n.getUILanguage()
  }
}
