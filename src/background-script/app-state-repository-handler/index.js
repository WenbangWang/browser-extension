import ListenerMessageHandler from '../../lib/ListenerMessageHandler'
import {appStateRepository} from '../repository'
import wrapper from './wrapper'

import AppStateCommand from '../../constants/AppStateCommand'

const handler = new ListenerMessageHandler()
const wrappedRepository = wrapper(appStateRepository)

handler.add(AppStateCommand.GET_OR_DEFAULT_LOCALE, wrappedRepository.getOrDefaultLocale)
handler.add(AppStateCommand.GET_OR_DEFAULT_STORE_STATE, wrappedRepository.getOrDefaultStoreState)
handler.add(AppStateCommand.UPDATE_LOCALE, wrappedRepository.setLocale)
handler.add(AppStateCommand.UPDATE_STORE_STATE, wrappedRepository.setStoreState)

export default handler
