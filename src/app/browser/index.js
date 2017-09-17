import browser from '../../browser-api'
import wrapAsyncFunctionFactory from './wrapAsyncFunctionFactory'
import LocalStorageService from './LocalStorageService'

const wrapAsyncFunction = wrapAsyncFunctionFactory(browser)

export const localStorageService = new LocalStorageService(browser, wrapAsyncFunction)
