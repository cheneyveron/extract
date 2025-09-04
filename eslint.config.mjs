/**
 * SPDX-FileCopyrightText: 2025 LibreCode coop and contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */

import { recommended } from '@nextcloud/eslint-config'
import globals from 'globals'

export default [
	...recommended,
	{
		name: 'extract/ignores',
		ignores: [
			// Generated files
			'src/types/openapi/*',
			'js/*',
			// TODO: upstream
			'openapi-*.json',
			'node_modules',
		],
	},
	{
		name: 'extract/config',
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
				__webpack_public_path__: 'writable',
			},
		},
	},
	{
		name: 'extract/disabled-during-migration',
		rules: {
			'@nextcloud-l10n/non-breaking-space': 'off', // changes translation strings
			'@nextcloud-l10n/non-breaking-space-vue': 'off', // changes translation strings
			'@typescript-eslint/no-unused-expressions': 'off', // non-fixable
			'@typescript-eslint/no-unused-vars': 'off', // non-fixable
			'@typescript-eslint/no-use-before-define': 'off', // non-fixable
			'jsdoc/require-param-type': 'off', // need to respect JS
			'jsdoc/require-param-description': 'off', // need to respect JS
			'no-console': 'off', // non-fixable
			'no-unused-vars': 'off', // non-fixable
			'no-use-before-define': 'off', // non-fixable
			'vue/multi-word-component-names': 'off', // non-fixable
			'vue/no-boolean-default': 'off', // non-fixable
			'vue/no-required-prop-with-default': 'off', // non-fixable
			'vue/no-unused-properties': 'off', // non-fixable
			'vue/no-unused-refs': 'off', // non-fixable
		},
	},
]
