'use strict'

// Add more supported languages here.
const SUPPORTED_LANGUAGES = ['en']
// Create a webpack context for language files.
const languageContext = require.context('../../../../locales', true, /\.properties$/)
// Load language files.
const LANGUAGES_MAP = SUPPORTED_LANGUAGES.map(language => languageContext(`./${language}/browser-extension/index.properties`))
// Uncomment this variable when we start supporting multiple languages.
// This is a language key and its alias mapping using wildcard.
// const LANGUAGE_KEYS_ALIASES = SUPPORTED_LANGUAGES.reduce((map, language) => {
//   map[`${language}-*`] = language
//   map[`${language}_*`] = language
//   return map
// }, {})

/* @ngInject */
function i18nConfig ($translateProvider) {
  SUPPORTED_LANGUAGES.forEach((language, index) => $translateProvider.translations(language, LANGUAGES_MAP[index]))

  $translateProvider.preferredLanguage(SUPPORTED_LANGUAGES[0])
  // For security sake.
  $translateProvider.useSanitizeValueStrategy('escapeParameters')

  // Uncomment these two lines when we start supporting multiple languages.
  // $translateProvider.registerAvailableLanguageKeys(SUPPORTED_LANGUAGES, LANGUAGE_KEYS_ALIASES)
  // $translateProvider.determinePreferredLanguage()
}

module.exports = i18nConfig
