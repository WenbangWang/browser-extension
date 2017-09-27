import merge from 'lodash.merge'

// Cannot use object deconstruct because of Webpack EnvironmentPlugin only apply
const CONFIG_OVERRIDE_KEY = process.env.CONFIG_OVERRIDE_KEY
const EXTENSION_CONFIG = process.env.EXTENSION_CONFIG

const {appMode, locale, logLevel} = window[CONFIG_OVERRIDE_KEY] || {}
/**
 * @type {EPNExtensionConfig}
 */
const config = merge(EXTENSION_CONFIG, {appMode, locale, logLevel})

export default config

/**
 * @typedef {Object} EPNExtensionConfig
 *
 * @property {String} appMode - The mode where the app is running as. It can be EXTENSION or WEB_APP.
 * @property {Object} locale - Note that the locale has to be aligned to the pattern of "locales" directory.
 * @property {String} locale.default - Default locale.
 * @property {Array<String>} locale.others - Other supported locales.
 */
