import AppStateRepository from './AppStateRepository'
import {localStorageService} from '../../lib/browser'

const STORE_STATE_KEY = 'store_state'
const LANG_KEY = 'lang'

const appStateRepository = new AppStateRepository(localStorageService, STORE_STATE_KEY, LANG_KEY)

export {
  appStateRepository
}
