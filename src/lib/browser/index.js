import browser from '../../browser-api'
import wrapAsyncFunctionFactory from './wrapAsyncFunctionFactory'
import LocalStorageService from './LocalStorageService'
import I18nService from './I18nService'
import RuntimeMessagingClient from './RuntimeMessagingClient'

const wrapAsyncFunction = wrapAsyncFunctionFactory(browser)
const localStorageService = new LocalStorageService(browser, wrapAsyncFunction)
const i18nService = new I18nService(browser)
const runtimeMessagingClient = new RuntimeMessagingClient(browser, wrapAsyncFunction)

export {
  localStorageService,
  i18nService,
  runtimeMessagingClient,
  wrapAsyncFunction
}
