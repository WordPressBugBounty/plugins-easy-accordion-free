<?php
/**
 * EAP_File_System File.
 *
 * @since 4.1.0
 * @version 1.0.0
 *
 * @package EasyAccordion/Blocks
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * EAP_File_System.
 */
class EAP_File_System {

	/**
	 * Tracks whether WP_Filesystem is initialized.
	 *
	 * @var bool|null
	 */
	private $filesystem_initialized = null;

	/**
	 * Read the contents of a file using WP_Filesystem.
	 *
	 * @param string $path File path.
	 * @return string File contents.
	 */
	public function get_file_contents( $path ) {
		if ( ! $this->safe_filesystem_exists( $path ) ) {
			return '';
		}

		return $this->safe_filesystem_get_contents( $path );
	}

	/**
	 * Initialize WordPress filesystem safely.
	 *
	 * @return bool
	 */
	public function init_filesystem() {
		// Return cached result if already initialized.
		if ( null !== $this->filesystem_initialized ) {
			return $this->filesystem_initialized;
		}

		require_once ABSPATH . 'wp-admin/includes/file.php';
		global $wp_filesystem;

		if ( ! function_exists( 'WP_Filesystem' ) ) {
			$this->filesystem_initialized = false;
			return false;
		}

		$filesystem_ready = WP_Filesystem();

		if ( ! $filesystem_ready || empty( $wp_filesystem ) ) {
			$this->filesystem_initialized = false;
			return false;
		}

		$this->filesystem_initialized = true;
		return true;
	}

	/**
	 * Safely checks file existence using WP_Filesystem with local fallback.
	 *
	 * @param string $file_path Absolute file path.
	 *
	 * @return bool
	 */
	public function safe_filesystem_exists( $file_path ) {
		global $wp_filesystem;

		$file_path = $this->normalize_path( $file_path );

		if ( $this->init_filesystem() && $wp_filesystem ) {
			try {
				return (bool) $wp_filesystem->exists( $file_path );
			} catch ( \Throwable $e ) {
				$this->print_file_system_error( $e );
			}
		}

		return file_exists( $file_path );
	}

	/**
	 * Safely writes file contents using WP_Filesystem with local fallback.
	 *
	 * @param string $file_path Absolute file path.
	 * @param string $contents  File contents.
	 *
	 * @return bool
	 */
	public function safe_filesystem_put_contents( $file_path, $contents ) {
		global $wp_filesystem;

		$file_path = $this->normalize_path( $file_path );

		if ( $this->init_filesystem() && $wp_filesystem ) {
			try {
				$written = $wp_filesystem->put_contents( $file_path, $contents );
				if ( false !== $written ) {
					return true;
				}
			} catch ( \Throwable $e ) {
				$this->print_file_system_error( $e );
			}
		}

		$dir_path = dirname( $file_path );
		if ( ! file_exists( $dir_path ) ) {
			wp_mkdir_p( $dir_path );
		}

		return false !== file_put_contents( $file_path, $contents );
	}

	/**
	 * Safely reads file contents using WP_Filesystem with local fallback.
	 *
	 * @param string $file_path Absolute file path.
	 *
	 * @return string
	 */
	public function safe_filesystem_get_contents( $file_path ) {
		global $wp_filesystem;

		$file_path = $this->normalize_path( $file_path );

		if ( $this->init_filesystem() && $wp_filesystem ) {
			try {
				$content = $wp_filesystem->get_contents( $file_path );
				if ( false !== $content ) {
					return $content;
				}
			} catch ( \Throwable $e ) {
				$this->print_file_system_error( $e );
			}
		}

		if ( file_exists( $file_path ) ) {
			$content = file_get_contents( $file_path );
			return false !== $content ? $content : '';
		}

		return '';
	}

	/**
	 * Safely deletes file using WP_Filesystem with local fallback.
	 *
	 * @param string $file_path Absolute file path.
	 *
	 * @return bool
	 */
	public function safe_filesystem_delete( $file_path ) {
		global $wp_filesystem;

		$file_path = $this->normalize_path( $file_path );

		if ( $this->init_filesystem() && $wp_filesystem ) {
			try {
				if ( $wp_filesystem->exists( $file_path ) ) {
					return (bool) $wp_filesystem->delete( $file_path );
				}
			} catch ( \Throwable $e ) {
				$this->print_file_system_error( $e );
			}
		}

		if ( file_exists( $file_path ) ) {
			return (bool) @unlink( $file_path );
		}

		return false;
	}

	/**
	 * Method normalize_path for Normalize path for cross-platform compatibility.
	 *
	 * @param string $path is file path.
	 * @return string
	 */
	private function normalize_path( $path ) {
		return wp_normalize_path( $path );
	}

	/**
	 * Method print_file_system_error.
	 *
	 * @param object $error is file system errors.
	 *
	 * @return void
	 */
	private function print_file_system_error( $error ) {
		// error_log( $error->getMessage() );
	}
}
