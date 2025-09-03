import { registerFileAction } from '@nextcloud/files'
import { extractAction } from './actions/extract-action.ts'

registerFileAction(extractAction)
