import type { Node, View } from '@nextcloud/files'

import ArchiveArrowUpSvg from '@mdi/svg/svg/archive-arrow-up.svg?raw'
import axios from '@nextcloud/axios'
import { emit } from '@nextcloud/event-bus'
import { FileAction, Folder, Permission } from '@nextcloud/files'
import { translate as t } from '@nextcloud/l10n'
import { generateUrl } from '@nextcloud/router'

export const extractAction = new FileAction({
	id: 'extract',
	displayName: () => t('extract', 'Extract here'),
	iconSvgInline: () => ArchiveArrowUpSvg,

	enabled(nodes: Node[]) {
		if (nodes.length !== 1) {
			return false
		}

		const node = nodes[0]!

		const ct = node.attributes?.getcontenttype as string | undefined

		if (
			ct === 'application/zip'
			|| ct === 'application/x-tar'
			|| ct === 'application/gzip'
			|| ct === 'application/x-rar-compressed'
			|| ct === 'application/x-7z-compressed'
			|| ct === 'application/x-deb'
			|| ct === 'application/x-bzip2'
		) {
			return (node.permissions & Permission.UPDATE) !== 0
		}

		return false
	},

	async exec(node: Node, view: View, dir: string) {
		const data = {
			nameOfFile: node.attributes?.basename ?? '',
			directory: dir,
			external: node.attributes?.['mount-type']?.startsWith('external') ? 1 : 0,
			mime: node.attributes?.mime,
		}

		const url = generateUrl('/apps/extract/ajax/extract.php')
		axios.post(url, data)
			.then((resp) => resp.data)
			.then((data) => {
				const time = data.extracted.mtime * 1000
				const folder = new Folder({
					id: data.extracted.fileId,
					source: data.extracted.source,
					root: data.extracted.root,
					owner: data.extracted.owner,
					permissions: data.extracted.permissions,
					mtime: new Date(time),
					attributes: {
						'mount-type': data.extracted['mount-type'],
						'owner-id': data.extracted.owner,
						'owner-display-name': data.extracted['owner-display-name'],
					},
				})

				emit('files:node:created', folder)

				window.OCP.Files.Router.goToRoute(
					{ view: 'files', fileid: data.fileId },
					{ dir },
				)
				return null
			})
			.catch((error) => {
				console.log('Could not send extract request.')
				console.log(error)
			})
		return null
	},

	order: 25,
})
