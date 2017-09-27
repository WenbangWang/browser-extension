import AppStateSyncService from './AppStateSyncService'
import appLanguageService from '../app-language-service'
import appRuntimeMessagingClient from '../app-runtime-messaging-client'
import vuexRouterSync from 'vuex-router-sync'
import config from '../../config'
import AppStateCommand from '../../../constants/AppStateCommand'
import APP_MODE from '../../../../constants/APP_MODE'

export default new AppStateSyncService(appRuntimeMessagingClient, appLanguageService, vuexRouterSync, config, window, AppStateCommand, APP_MODE)

/**
 * @typedef {Object} VuexRouterSync
 *
 * @property {Function} sync
 */
