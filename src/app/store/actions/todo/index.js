import todoActions from './todo'
import {localStorageService} from '../../../../lib/browser'
import todoMutationConstants from '../../constants/mutations'
import miscConstants from '../../constants/misc'

export default todoActions(localStorageService, todoMutationConstants, miscConstants)