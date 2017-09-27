import ShellController from './ShellController'
import {runtimeMessagingClient} from '../../../lib/browser'
import ShellControlCommand from '../../../constants/ShellControlCommand'

export default new ShellController(runtimeMessagingClient, ShellControlCommand)
