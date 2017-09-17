import todoMutations from './todo'
import {localStorageService} from '../../../browser'
import todoMutationConstants from '../../constants/mutations'
import miscConstants from '../../constants/misc'

export default todoMutations(localStorageService, todoMutationConstants, miscConstants)
