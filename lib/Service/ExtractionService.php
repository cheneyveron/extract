<?php

/**
 * @author Paul Lereverend
 * @copyright 2012-2022 Paul Lereverend <paulereverend@gmail.com>
 * @author Claus-Justus Heine
 * @copyright 2022 Claus-Justus Heine <himself@claus-justus-heine.de>
 * @license AGPL-3.0-or-later
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

namespace OCA\Extract\Service;

use OCP\IL10N;
use Psr\Log\LoggerInterface;
use ZipArchive;

final class ExtractionService {

	public function __construct(
		private IL10N $l,
		private LoggerInterface $logger,
	) {
	}

	/**
	 * @return (bool|int|mixed)[]
	 *
	 * @psalm-return array{code: 0|1, desc?: string}
	 */
	public function extractZip(string $file, string $extractTo): array {
		$response = [];

		if (!extension_loaded('zip')) {
			$response = array_merge($response, ['code' => 0, 'desc' => $this->l->t('Zip extension is not available')]);
			return $response;
		}

		$zip = new ZipArchive();

		if ($zip->open($file) !== true) {
			$response = array_merge($response, ['code' => 0, 'desc' => $this->l->t('Cannot open Zip file')]);
			return $response;
		}

		$success = $zip->extractTo($extractTo);
		$zip->close();
		$response = array_merge($response, ['code' => $success ? 1 : 0]);
		return $response;
	}

	/**
	 * @return (int|mixed)[]
	 *
	 * @psalm-return array{code: 0|1, desc?: string}
	 */
	public function extractRar(string $file, string $extractTo): array {
		$response = [];

		if (!extension_loaded('rar')) {
			// Try different RAR extraction tools in order of preference
			$success = false;
			
			// Try unrar first (most common)
			if (shell_exec('which unrar 2>/dev/null')) {
				exec('unrar x ' . escapeshellarg($file) . ' -R ' . escapeshellarg($extractTo) . '/ -o+', $output, $return);
				if (count($output) > 4 && $return === 0) {
					$success = true;
				}
			}
			
			// Try unar as alternative if unrar failed or not available
			if (!$success && shell_exec('which unar 2>/dev/null')) {
				exec('unar ' . escapeshellarg($file) . ' -o ' . escapeshellarg($extractTo) . ' -f', $output, $return);
				if ($return === 0) {
					$success = true;
				}
			}
			
			if (!$success) {
				$response = array_merge($response, ['code' => 0, 'desc' => $this->l->t('RAR extraction failed. Please install unrar, unar, or the rar PHP extension')]);
				return $response;
			}
		} else {
			$rar_file = rar_open($file);
			$list = rar_list($rar_file);
			foreach ($list as $archive_file) {
				$entry = rar_entry_get($rar_file, $archive_file->getName());
				$entry->extract($extractTo);
			}
			rar_close($rar_file);
		}

		$response = array_merge($response, ['code' => 1]);
		return $response;
	}

	/**
	 * @return (int|mixed)[]
	 *
	 * @psalm-return array{code: 0|1, desc?: string}
	 */
	public function extractOther(string $file, string $extractTo): array {
		$response = [];

		exec('7za -y x ' . escapeshellarg($file) . ' -o' . escapeshellarg($extractTo), $output, $return);

		if (count($output) <= 5) {
			$response = array_merge($response, ['code' => 0, 'desc' => $this->l->t('Oops something went wrong.')]);
			$this->logger->error('Is 7-Zip installed? Output: ' . print_r($output, true));
			return $response;
		}
		$response = array_merge($response, ['code' => 1]);
		return $response;
	}
}
