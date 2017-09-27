import AppRuntimeMessagingClient from './AppRuntimeMessagingClient'
import meta from '../../meta'
import browser from '../../../browser-api'
import {wrapAsyncFunction} from '../../../lib/browser'

export default new AppRuntimeMessagingClient(meta, browser, wrapAsyncFunction)
