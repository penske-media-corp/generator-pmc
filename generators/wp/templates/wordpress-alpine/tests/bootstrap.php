<?php
/**
 * IMPORTANT: Do not add any code before this require_once statement below
 */
require_once getenv('PMC_PHPUNIT_BOOTSTRAP');

tests_add_filter('after_setup_theme', function () {
	// @TODO: register additional namespaces, load plugins, etc...

});

PMC\Unit_Test\Bootstrap::get_instance()->start([
	'theme'      => getenv( 'WORDPRESS_THEME' ),
	'namespace'  => getenv( 'WORDPRESS_THEME_NAMESPACE' ),
	'tests_path' => __DIR__,
]);
