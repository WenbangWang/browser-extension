import Vue from 'vue'
import VueI18n from 'vue-i18n'
import config from './config'

Vue.use(VueI18n)

const {locale} = config
const DEFAULT_LOCALE = locale.default
const SUPPORTED_LOCALES = [DEFAULT_LOCALE, ...locale.others]
const DIRECTORY_PATHS = SUPPORTED_LOCALES.map(local => local.includes('-') ? local.split('-').reverse().join('/') : local)
// Create a webpack context for language files.
const languageContext = require.context('../../locales', true, /\.properties$/)
// Load language files.
const LANGUAGES = DIRECTORY_PATHS.map(path => languageContext(`./${path}/browser-extension/index.properties`))

const messages = SUPPORTED_LOCALES.reduce((map, locale, index) => {
  map[locale] = LANGUAGES[index]
  return map
}, {})

export default new VueI18n({
  // Need to be set dynamically during runtime local detection.
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages
})
