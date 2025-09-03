/**
 * SPDX-FileCopyrightText: 2023 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

declare global {
	interface Window {
		OCP: Nextcloud.v29.OCP
	}
	declare module '*.svg?raw' {
		const content: string
		export default content
	}
}

export {}
