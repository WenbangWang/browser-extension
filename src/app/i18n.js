import Vue from 'vue'
import VueI18n from 'vue-i18n'
import appLanguageService from './lib/app-language-service'
import merge from 'lodash.merge'

Vue.use(VueI18n)

const DEFAULT_LOCALE = appLanguageService.getDefaultLocale()
const SUPPORTED_LOCALES = appLanguageService.getAllSupportedLocales()
const DIRECTORY_PATHS = SUPPORTED_LOCALES.map(local => local.includes('-') ? local.split('-').reverse().join('/') : local)

const languageContext = createWebpackLocaleResourceContext()
const LANGUAGES = loadLanguageFilesFromContext(languageContext)

const messages = SUPPORTED_LOCALES.reduce((map, locale, index) => {
  map[locale] = LANGUAGES[index]
  return map
}, {})

const i18n = new VueI18n({
  locale: appLanguageService.getCurrentLocale(),
  fallbackLocale: DEFAULT_LOCALE,
  messages
})

if (module.hot) {
  module.hot.accept(languageContext.id, () => {
    const LANGUAGES = loadLanguageFilesFromContext(createWebpackLocaleResourceContext())

    LANGUAGES.forEach((language, index) => i18n.setLocaleMessage(SUPPORTED_LOCALES[index], language))
  })
}

export default i18n

function createWebpackLocaleResourceContext () {
  return require.context('../../locales', true, /browser-extension\/(.*)\.properties$/)
}

function loadLanguageFilesFromContext (context) {
  const keys = context.keys()
  return DIRECTORY_PATHS.map(loadAndMergeAllFromPath(context, keys))
}

function loadAndMergeAllFromPath (load, keys) {
  return path => merge(
    {},
    ...keys
      .filter(key => key.match(new RegExp(`./${path}/browser-extension`))) // Exclude files not part of current locale (using path to represent)
      .map(load)
  )
}
