import AppLanguageService from './AppLanguageService'
import {i18nService} from '../../../lib/browser'
import config from '../../config'

export default new AppLanguageService(i18nService, config)
