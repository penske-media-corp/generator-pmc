<?php
require_once getenv('PMC_PHPUNIT_BOOTSTRAP');
 
tests_add_filter('after_setup_theme', function () {
    \PMC\Unit_Test\Autoloader::register( 'PMC\My_Plugin\Tests', __DIR__ );
});
 
PMC\Unit_Test\Bootstrap::get_instance()->start();
// EOF<?php
define( 'IS_UNIT_TESTING', true );

// Load Core's test suite.
$_tests_dir = getenv( 'WP_TESTS_CONFIG_FILE_PATH' );
require_once $_tests_dir . '/includes/functions.php';

/**
 * Setup our environment (theme, plugins).
 */
tests_add_filter( 'muplugins_loaded', function () {

	error_reporting( E_CORE_ERROR | E_CORE_WARNING | E_COMPILE_ERROR | E_ERROR | E_WARNING | E_PARSE | E_USER_ERROR | E_USER_WARNING | E_RECOVERABLE_ERROR ); //@codingStandardsIgnoreLine

	if ( ! defined( 'JETPACK_DEV_DEBUG' ) ) {
		define( 'JETPACK_DEV_DEBUG', true );
	}


	// workaround falt errors where $wp_rewrite object have not been initialized.
	remove_action( 'switch_theme', 'rri_wpcom_action_switch_theme' );

	switch_theme( getenv( 'WORDPRESS_THEME' ) );

	// load mocks - this should load after any plugins that should be loaded
	require_once __DIR__ . '/helpers/plugin-function-mocks.php';

} );

tests_add_filter( 'after_setup_theme', function () {
	pmc_load_plugin( 'pmc-unit-test', 'pmc-plugins' );

} );

// Include core's bootstrap.
require $_tests_dir . '/includes/bootstrap.php';
