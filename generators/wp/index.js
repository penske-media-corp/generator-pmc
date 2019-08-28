'use strict';
var chalk          = require('chalk');
var exec           = require('child_process').exec;
var os             = require('os');
var glob           = require("glob");
var path           = require('path');
var process        = require('process');
var uuid           = require('node-uuid');
var yeoman         = require('yeoman-generator');
var yosay          = require('yosay');
var DockerHelper   = require('./dockerHelper.js');
var error          = false;

var APP_ENV                         = 'dev';
var CACHE_DIR                       = './.cache'
var COMPOSER_CACHE_DIR              = '/root/.cache/composer';
var COMPOSER_HOME                   = '/root/.config/composer';
var COMPOSER_VERSION                = '1.8.5';
var DB_VERSION                      = '10.3';
var DIFF_FILE                       = '/tmp/' + process.cwd().split(path.sep).pop().toLowerCase() + '.diff';
var DIFF_FILE_CSS                   = '/tmp/' + process.cwd().split(path.sep).pop().toLowerCase() + '-css.diff';
var DIFF_FILE_JS                    = '/tmp/' + process.cwd().split(path.sep).pop().toLowerCase() + '-js.diff';
var DIFF_FILE_PHP                   = '/tmp/' + process.cwd().split(path.sep).pop().toLowerCase() + '-php.diff';
var DIFF_FILE_SCSS                  = '/tmp/' + process.cwd().split(path.sep).pop().toLowerCase() + '-scss.diff';
var JETPACK_DEV_DEBUG               = true;
var MARIADB_HOST                    = 'db';
var MARIADB_PORT_NUMBER             = '3306';
var MEMCACHED_VERSION               = '1.5';
var MULTISITE                       = false;
var MYSQL_DATABASE                  = 'wp';
var MYSQL_PASSWORD                  = 'wp';
var MYSQL_ROOT_PASSWORD             = 'wp';
var MYSQL_USER                      = 'wp';
var MYSQL_VOLUMES                   = './.cache/mysql';
var NGINX_VERSION                   = '1.16';
var NODE_VERSION                    = '10.13.0';
var ORG                             = 'penskemediacorp';
var ORG_URL                         = 'https://pmc.com/contact';
var PARATEST                        = true;
var PHPCS_FILE                      = '/tmp/phpcs.json';
var PHPCS_STANDARD                  = 'PmcWpVip';
var PHPUNIT_EXCLUDE_GROUPS          = 'pmc-phpunit-ignore-failed';
var PHP_VERSION                     = '7.3';
var TEXT_DOMAIN                     = process.cwd().split(path.sep).pop().toLowerCase();
var WWW_ROOT                        = '/var/www';
var WEB_ROOT                        = WWW_ROOT + '/html';
var PMC_PHPUNIT_BOOTSTRAP           = WEB_ROOT + '/wp-content/plugins/pmc-plugins/pmc-unit-test/bootstrap.php';
var WORDPRESS_ADMIN_PASSWORD        = 'wp';
var WORDPRESS_ADMIN_USER            = 'wp';
var WORDPRESS_COMPOSER_PACKAGE_TYPE = '';
var WORDPRESS_DB_HOST               = 'db';
var WORDPRESS_DB_NAME               = 'wp';
var WORDPRESS_DB_PASSWORD           = 'wp';
var WORDPRESS_DB_USER               = 'wp';
var WORDPRESS_DOMAIN                = process.cwd().split(path.sep).pop().toLowerCase() + '.pmcdev.local';
var WORDPRESS_EMAIL                 = 'dist.dev@pmc.com';
var WORDPRESS_PARENT_THEME          = 'pmc-core-v2';
var WORDPRESS_TABLE_PREFIX          = 'wp_';
var WORDPRESS_TEST_DB_HOST          = 'test-db';
var WORDPRESS_THEME                 = process.cwd().split(path.sep).pop().toLowerCase();
var WORDPRESS_THEME_PHP_NAMESPACE   = process.cwd().split(path.sep).pop().replace('pmc-', '').replace(/\-\d+/g,'').toLowerCase().replace(/(?<=\-)[^\-]|^./g, a=>a.toUpperCase()).replace('-','_');
var WORDPRESS_TITLE                 = process.cwd().split(path.sep).pop().toLowerCase();
var WORDPRESS_VERSION               = '5.2';
var XDEBUG_IDEKEY                   = process.cwd().split(path.sep).pop().toLowerCase();
var XDEBUG_REMOTE_AUTOSTART         = '1';
var XDEBUG_REMOTE_CONNECT_BACK      = '0';
var XDEBUG_REMOTE_ENABLE            = '1';
var XDEBUG_REMOTE_HANDLER           = 'dbgp';
var XDEBUG_REMOTE_HOST              = '172.30.0.1';
var XDEBUG_REMOTE_PORT              = '9000';

function showPrompts() {
	var done = this.async();
	var prompts = [{
		type: 'input',
		name: 'APP_ENV',
		message: 'Default WordPress dev environment?',
		default: APP_ENV
		}, {
		type: 'list',
		name: 'WORDPRESS_COMPOSER_PACKAGE_TYPE',
		message: 'WordPress composer package type?',
		choices: [{
				name: 'Dropin',
				value: 'dropin'
			}, {
				name: 'Plugin',
				value: 'wordpress-plugin'
			}, {
				name: 'MU plugin',
				value: 'wordpress-mu-plugin'
			}, {
				name: 'Theme',
				value: 'wordpress-theme'
			}]
		}, {
			type: 'input',
			name: 'COMPOSER_VERSION',
			message: 'Version of composer you want to use?',
			default: COMPOSER_VERSION
		}, {
			type: 'input',
			name: 'DB_VERSION',
			message: 'Version of sql you want?',
			default: DB_VERSION
		}, {
			type: 'confirm',
			name: 'MULTISITE',
			message: 'WordPress Multisite?',
			default: MULTISITE
		}, {
			type: 'input',
			name: 'NGINX_VERSION',
			message: 'nginx version?',
			default: NGINX_VERSION
		}, {
			type: 'input',
			name: 'NODE_VERSION',
			message: 'Version of node?',
			default: NODE_VERSION
		}, {
			type: 'input',
			name: 'ORG',
			message: 'Org name?',
			default: ORG
		}, {
			type: 'input',
			name: 'ORG_URL',
			message: 'Org URL?',
			default: ORG_URL
		}, {
			type: 'input',
			name: 'PHPCS_STANDARD',
			message: 'PHPCS default standard?',
			default: PHPCS_STANDARD
		}, {
			type: 'input',
			name: 'PHP_VERSION',
			message: 'PHP version?',
			default: PHP_VERSION
		}, {
			type: 'input',
			name: 'TEXT_DOMAIN',
			message: 'Theme text-domain?',
			default: TEXT_DOMAIN
		}, {
			type: 'input',
			name: 'WEB_ROOT',
			message: 'Default web root?',
			default: '/var/www/html'
		}, {
			type: 'input',
			name: 'WORDPRESS_ADMIN_PASSWORD',
			message: 'Default WordPress admin password?',
			default: WORDPRESS_ADMIN_PASSWORD
		}, {
			name: 'WORDPRESS_ADMIN_USER',
			message: 'Default WordPress user?',
			default: WORDPRESS_ADMIN_USER
		}, {
			type: 'input',
			name: 'WORDPRESS_DB_HOST',
			message: 'Default WordPress DB host?',
			default: WORDPRESS_DB_HOST
		}, {
			type: 'input',
			name: 'WORDPRESS_DB_NAME',
			message: 'Default WordPress DB host?',
			default: WORDPRESS_DB_NAME
		}, {
			type: 'input',
			name: 'WORDPRESS_DB_PASSWORD',
			message: 'Default WordPress DB password?',
			default: WORDPRESS_DB_PASSWORD
		}, {
			type: 'input',
			name: 'WORDPRESS_DB_USER',
			message: 'Default WordPress DB user ?',
			default: WORDPRESS_DB_USER
		}, {
			name: 'WORDPRESS_DB_NAME',
			message: 'Default DB name?',
			default: WORDPRESS_DB_NAME
		}, {
			type: 'input',
			name: 'WORDPRESS_DOMAIN',
			message: 'Default WordPress dev domain?',
			default: WORDPRESS_DOMAIN
		}, {
			type: 'input',
			name: 'WORDPRESS_EMAIL',
			message: 'Default WordPress email?',
			default: WORDPRESS_EMAIL
		}, {
			type: 'input',
			name: 'WORDPRESS_PARENT_THEME',
			message: 'Default WordPress parent theme? ( leave blank if none )',
			default: WORDPRESS_PARENT_THEME
		}, {
			type: 'input',
			name: 'WORDPRESS_TABLE_PREFIX',
			message: 'WordPress table prefix',
			default: WORDPRESS_TABLE_PREFIX
		}, {
			type: 'input',
			name: 'WORDPRESS_TEST_DB_HOST',
			message: 'WordPress test db host',
			default: WORDPRESS_TEST_DB_HOST
		}, {
			type: 'confirm',
			name: 'PARATEST',
			message: 'Use paratest? ( no guarantees on out of the box support )',
			default: PARATEST
		}, {
			type: 'input',
			name: 'WORDPRESS_THEME_PHP_NAMESPACE',
			message: 'Default WordPress theme php namespace',
			default: WORDPRESS_THEME_PHP_NAMESPACE
		}, {
			type: 'input',
			name: 'WORDPRESS_THEME',
			message: 'Default WordPress theme',
			default: WORDPRESS_THEME
		}, {
			type: 'input',
			name: 'WORDPRESS_TITLE',
			message: 'Default WordPress title?',
			default: process.cwd().split(path.sep).pop().toLowerCase()
		}, {
			type: 'input',
			name: 'WORDPRESS_VERSION',
			message: 'Default WordPress version?',
			default: WORDPRESS_VERSION
	}];

	this.prompt(prompts, function (props) {
		APP_ENV                         = props.APP_ENV;
		COMPOSER_CACHE_DIR              = COMPOSER_CACHE_DIR;
		COMPOSER_HOME                   = COMPOSER_HOME;
		COMPOSER_VERSION                = COMPOSER_VERSION;
		DB_VERSION                      = props.DB_VERSION;
		DIFF_FILE                       = DIFF_FILE;
		DIFF_FILE_CSS                   = DIFF_FILE_CSS;
		DIFF_FILE_JS                    = DIFF_FILE_JS;
		DIFF_FILE_PHP                   = DIFF_FILE_PHP;
		DIFF_FILE_SCSS                  = DIFF_FILE_SCSS;
		MEMCACHED_VERSION               = MEMCACHED_VERSION;
		MULTISITE                       = props.MULTISITE;
		MYSQL_DATABASE                  = props.MYSQL_DATABASE;
		MYSQL_PASSWORD                  = props.MYSQL_PASSWORD;
		MYSQL_ROOT_PASSWORD             = props.MYSQL_ROOT_PASSWORD;
		MYSQL_USER                      = props.MYSQL_USER;
		JETPACK_DEV_DEBUG               = JETPACK_DEV_DEBUG;
		MYSQL_VOLUMES                   = MYSQL_VOLUMES;
		NGINX_VERSION                   = props.NGINX_VERSION;
		NODE_VERSION                    = props.NODE_VERSION;
		ORG                             = props.ORG;
		ORG_URL                         = props.ORG_URL;
		PARATEST                        = props.PARATEST;
		PHPCS_STANDARD                  = props.PHPCS_STANDARD;
		PHPCS_FILE                      = PHPCS_FILE;
		MARIADB_HOST                    = MARIADB_HOST;
		MARIADB_PORT_NUMBER             = MARIADB_PORT_NUMBER;
		PHP_VERSION                     = props.PHP_VERSION;
		TEXT_DOMAIN                     = props.TEXT_DOMAIN;
		WWW_ROOT                        = props.WWW_ROOT;
		WEB_ROOT                        = props.WEB_ROOT;
		WORDPRESS_ADMIN_PASSWORD        = props.WORDPRESS_ADMIN_PASSWORD;
		WORDPRESS_ADMIN_USER            = props.WORDPRESS_ADMIN_USER;
		WORDPRESS_DB_HOST               = props.WORDPRESS_DB_HOST;
		WORDPRESS_COMPOSER_PACKAGE_TYPE = props.WORDPRESS_COMPOSER_PACKAGE_TYPE;
		WORDPRESS_DB_NAME               = props.WORDPRESS_DB_NAME;
		WORDPRESS_DB_PASSWORD           = props.WORDPRESS_DB_PASSWORD;
		WORDPRESS_DB_USER               = props.WORDPRESS_DB_USER;
		PHPUNIT_EXCLUDE_GROUPS          = PHPUNIT_EXCLUDE_GROUPS;
		PMC_PHPUNIT_BOOTSTRAP           = PMC_PHPUNIT_BOOTSTRAP;
		WORDPRESS_DOMAIN                = props.WORDPRESS_DOMAIN;
		WORDPRESS_EMAIL                 = props.WORDPRESS_EMAIL;
		WORDPRESS_PARENT_THEME          = props.WORDPRESS_PARENT_THEME;
		WORDPRESS_TABLE_PREFIX          = props.WORDPRESS_TABLE_PREFIX;
		WORDPRESS_TEST_DB_HOST          = props.WORDPRESS_TEST_DB_HOST;
		WORDPRESS_THEME                 = props.WORDPRESS_THEME;
		WORDPRESS_THEME_PHP_NAMESPACE   = props.WORDPRESS_THEME_PHP_NAMESPACE;
		WORDPRESS_TITLE                 = props.WORDPRESS_TITLE;
		WORDPRESS_VERSION               = props.WORDPRESS_VERSION;
		XDEBUG_IDEKEY                   = XDEBUG_IDEKEY;
		XDEBUG_REMOTE_AUTOSTART         = XDEBUG_REMOTE_AUTOSTART;
		XDEBUG_REMOTE_CONNECT_BACK      = XDEBUG_REMOTE_CONNECT_BACK;
		XDEBUG_REMOTE_ENABLE            = XDEBUG_REMOTE_ENABLE;
		XDEBUG_REMOTE_HANDLER           = XDEBUG_REMOTE_HANDLER;
		XDEBUG_REMOTE_HOST              = XDEBUG_REMOTE_HOST;
		XDEBUG_REMOTE_PORT              = XDEBUG_REMOTE_PORT;
		done();
	}.bind(this));
}

function getDefaultTemplateData() {
	return {
		APP_ENV                         : APP_ENV,
		CACHE_DIR                       : CACHE_DIR,
		COMPOSER_CACHE_DIR              : COMPOSER_CACHE_DIR,
		COMPOSER_HOME                   : COMPOSER_HOME,
		MARIADB_HOST                    : MARIADB_HOST,
		MARIADB_PORT_NUMBER             : MARIADB_PORT_NUMBER,
		COMPOSER_VERSION                : COMPOSER_VERSION,
		DB_VERSION                      : DB_VERSION,
		DIFF_FILE                       : DIFF_FILE,
		DIFF_FILE_CSS                   : DIFF_FILE_CSS,
		DIFF_FILE_JS                    : DIFF_FILE_JS,
		DIFF_FILE_PHP                   : DIFF_FILE_PHP,
		DIFF_FILE_SCSS                  : DIFF_FILE_SCSS,
		JETPACK_DEV_DEBUG               : JETPACK_DEV_DEBUG,
		MEMCACHED_VERSION               : MEMCACHED_VERSION,
		MULTISITE                       : MULTISITE,
		MYSQL_DATABASE                  : MYSQL_DATABASE,
		MYSQL_PASSWORD                  : MYSQL_PASSWORD,
		MYSQL_ROOT_PASSWORD             : MYSQL_ROOT_PASSWORD,
		MYSQL_USER                      : MYSQL_USER,
		MYSQL_VOLUMES                   : MYSQL_VOLUMES,
		NGINX_VERSION                   : NGINX_VERSION,
		NODE_VERSION                    : NODE_VERSION,
		ORG                             : ORG,
		ORG_URL                         : ORG_URL,
		PARATEST                        : PARATEST,
		PHPCS_FILE                      : PHPCS_FILE,
		PHPCS_STANDARD                  : PHPCS_STANDARD,
		PHPUNIT_EXCLUDE_GROUPS          : PHPUNIT_EXCLUDE_GROUPS,
		PMC_PHPUNIT_BOOTSTRAP           : PMC_PHPUNIT_BOOTSTRAP,
		PHP_VERSION                     : PHP_VERSION,
		TEXT_DOMAIN                     : TEXT_DOMAIN,
		WWW_ROOT                        : WWW_ROOT,
		WEB_ROOT                        : WEB_ROOT,
		WORDPRESS_ADMIN_PASSWORD        : WORDPRESS_ADMIN_PASSWORD,
		WORDPRESS_ADMIN_USER            : WORDPRESS_ADMIN_USER,
		WORDPRESS_DB_HOST               : WORDPRESS_DB_HOST,
		WORDPRESS_COMPOSER_PACKAGE_TYPE : WORDPRESS_COMPOSER_PACKAGE_TYPE,
		WORDPRESS_DB_NAME               : WORDPRESS_DB_NAME,
		WORDPRESS_DB_PASSWORD           : WORDPRESS_DB_PASSWORD,
		WORDPRESS_DB_USER               : WORDPRESS_DB_USER,
		WORDPRESS_DOMAIN                : WORDPRESS_DOMAIN,
		WORDPRESS_EMAIL                 : WORDPRESS_EMAIL,
		WORDPRESS_PARENT_THEME          : WORDPRESS_PARENT_THEME,
		WORDPRESS_TABLE_PREFIX          : WORDPRESS_TABLE_PREFIX,
		WORDPRESS_TEST_DB_HOST          : WORDPRESS_TEST_DB_HOST,
		WORDPRESS_THEME                 : WORDPRESS_THEME,
		WORDPRESS_THEME_PHP_NAMESPACE   : WORDPRESS_THEME_PHP_NAMESPACE,
		WORDPRESS_TITLE                 : WORDPRESS_TITLE,
		WORDPRESS_VERSION               : WORDPRESS_VERSION,
		XDEBUG_IDEKEY                   : XDEBUG_IDEKEY,
		XDEBUG_REMOTE_AUTOSTART         : XDEBUG_REMOTE_AUTOSTART,
		XDEBUG_REMOTE_CONNECT_BACK      : XDEBUG_REMOTE_CONNECT_BACK,
		XDEBUG_REMOTE_ENABLE            : XDEBUG_REMOTE_ENABLE,
		XDEBUG_REMOTE_HANDLER           : XDEBUG_REMOTE_HANDLER,
		XDEBUG_REMOTE_HOST              : XDEBUG_REMOTE_HOST,
		XDEBUG_REMOTE_PORT              : XDEBUG_REMOTE_PORT
	};
}

function handleCommmonTemplates(yo, helper, templateData, cb) {
	yo.fs.copyTpl(
		yo.templatePath(helper.getTemplateDockerWp() + '/**'),
		yo.destinationPath('.'),
		templateData
	);
	yo.fs.copyTpl(
		yo.templatePath(helper.getTemplateDockerWp() + '/.*'),
		yo.destinationPath('.'),
		templateData,
		{ globOptions: { dot: true } }
	);
	cb();
	return;
}

function handleWp(yo) {
	var docker = new DockerHelper();
	var done = yo.async();
	var templateData = getDefaultTemplateData();
	handleCommmonTemplates(yo, docker, templateData, done.bind(yo));
}

function end() {
	if (error) {
		this.log(chalk.red('Errors occured. Please fix them and re-run the generator.'));
	} else {
		this.log("Don't forget to check configuration and ensure all dependencies are configured correctly.");
	}
	return;
}

var DockerGenerator = yeoman.generators.Base.extend({
	constructor: function () {
		yeoman.generators.Base.apply(this, arguments);
	},

	init: function () {
		this.log(yosay( chalk.red('PMC WordPress') + '\n ------ \n yo generator!'));
	},
	askFor: showPrompts,
	writing: function () {
		this.sourceRoot(path.join(__dirname, './templates'));
		handleWp(this);
	},
	end: end
});

module.exports = DockerGenerator;