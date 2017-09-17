import AppStateSyncService from './AppStateSyncService'
import {localStorageService} from '../../browser/index'
import vuexRouterSync from 'vuex-router-sync'
import config from '../../config'
import APP_MODE from '../../../../constants/APP_MODE'

export default new AppStateSyncService(localStorageService, vuexRouterSync, config, window, 'app_state', APP_MODE)
