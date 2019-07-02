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

var APP_ENV                    = 'dev';
var COMPOSER_VENDOR_DIR        = './vendor';
var COMPOSER_CACHE_DIR='/root/.cache/composer';
var COMPOSER_HOME='/root/.config/composer';
var COMPOSER_VERSION           = '1.8.5';
var DB_VERSION                 = '10.3';
var MEMCACHED_VERSION          = '1.5';
var MULTISITE                  = false;
var MYSQL_DATABASE             = 'wp';
var MYSQL_PASSWORD             = 'wp';
var MYSQL_ROOT_PASSWORD        = 'wp';
var MYSQL_USER                 = 'wp';
var MYSQL_VOLUMES              = './.cache/mysql';
var NGINX_VERSION              = '1.16';
var NODE_VERSION               = '10.13.0';
var ORG                        = 'penskemediacorp';
var ORG_URL                    = 'https://pmc.com/contact';
var PHPCS_STANDARD             = 'PmcWpVip';
var PHP_VERSION                = '7.3';
var TEXT_DOMAIN                = '';
var WEB_ROOT                   = '/var/www/html';
var WORDPRESS_ADMIN_PASSWORD   = 'wp';
var WORDPRESS_ADMIN_USER       = 'wp';
var WORDPRESS_CACHE            = './.cache/wp';
var WORDPRESS_DB_HOST          = 'db';
var WORDPRESS_DB_NAME          = 'wp';
var WORDPRESS_DB_PASSWORD      = 'wp';
var WORDPRESS_DB_USER          = 'wp';
var WORDPRESS_DOMAIN           = '';
var WORDPRESS_EMAIL            = 'dist.dev@pmc.com';
var WORDPRESS_HOST_ENVIRONMENT = '';
var WORDPRESS_PARENT_THEME     = 'pmc-core-v2';
var WORDPRESS_TABLE_PREFIX     = 'wp_';
var WORDPRESS_TEST_DB_HOST     = 'test-db';
var WORDPRESS_THEME            = '';
var WORDPRESS_TITLE            = '';
var WORDPRESS_VERSION          = '5.2';

function showPrompts() {
	var done = this.async();
	var prompts = [{
		type: 'list',
		name: 'WORDPRESS_HOST_ENVIRONMENT',
		message: 'WordPress host environment?',
		choices: [{
			name: 'Self hosted',
			value: 'selfHosted'
		},{
			name: 'WPCom',
			value: 'WORDPRESS_COM'
		},{
			name: 'WordPress VIP Go',
			value: 'WORDPRESS_VIP_GO'
		}]
	}, {
		type: 'input',
		name: 'APP_ENV',
		message: 'Default WordPress dev environment?',
		default: this.APP_ENV
		}, {
		type: 'list',
		name: 'WORDPRESS_COMPOSER_PACKAGE_TYPE',
		message: 'WordPress composer packag type?',
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
			default: this.COMPOSER_VERSION
		}, {
			type: 'input',
			name: 'DB_VERSION',
			message: 'Version of sql you want?',
			default: this.DB_VERSION
		}, {
			type: 'confirm',
			name: 'MULTISITE',
			message: 'WordPress Multisite?',
			default: false
		}, {
			type: 'confirm',
			name: 'NGINX_VERSION',
			message: 'nginx version?',
			default: this.NGINX_VERSION
		}, {
			type: 'input',
			name: 'NODE_VERSION',
			message: 'Version of node?',
			default: this.NODE_VERSION
		}, {
			type: 'input',
			name: 'ORG',
			message: 'Org name?',
			default: this.ORG
		}, {
			type: 'input',
			name: 'ORG_URL',
			message: 'Org URL?',
			default: this.ORG_URL
		}, {
			type: 'input',
			name: 'PHPCS_STANDARD',
			message: 'PHPCS default standard?',
			default: this.PHPCS_STANDARD
		}, {
			type: 'input',
			name: 'PHP_VERSION',
			message: 'PHP version?',
			default: this.PHP_VERSION
		}, {
			type: 'input',
			name: 'TEXT_DOMAIN',
			message: 'Theme text-domain?',
			default: process.cwd().split(path.sep).pop().toLowerCase()
		}, {
			type: 'input',
			name: 'WEB_ROOT',
			message: 'Default web root?',
			default: '/var/www/html'
		}, {
			type: 'input',
			name: 'WORDPRESS_ADMIN_PASSWORD',
			message: 'Default WordPress admin password?',
			default: this.WORDPRESS_ADMIN_PASSWORD
		}, {
			name: 'WORDPRESS_ADMIN_USER',
			message: 'Default WordPress user?',
			default: 'WORDPRESS_ADMIN_USER'
		}, {
			type: 'input',
			name: 'WORDPRESS_DB_HOST',
			message: 'Default WordPress DB host?',
			default: this.WORDPRESS_DB_HOST
		}, {
			type: 'input',
			name: 'WORDPRESS_DB_NAME',
			message: 'Default WordPress DB host?',
			default: this.WORDPRESS_DB_NAME
		}, {
			type: 'input',
			name: 'WORDPRESS_DB_PASSWORD',
			message: 'Default WordPress DB password?',
			default: this.WORDPRESS_DB_PASSWORD
		}, {
			type: 'input',
			name: 'WORDPRESS_DB_USER',
			message: 'Default WordPress DB user ?',
			default: this.WORDPRESS_DB_USER
		}, {
			name: 'WORDPRESS_DB_NAME',
			message: 'Default DB name?',
			default: this.WORDPRESS_DB_NAME
		}, {
			type: 'input',
			name: 'WORDPRESS_DOMAIN',
			message: 'Default WordPress dev domain?',
			default: process.cwd().split(path.sep).pop().toLowerCase() + '.pmcdev.local'
		}, {
			type: 'input',
			name: 'WORDPRESS_EMAIL',
			message: 'Default WordPress email?',
			default: this.WORDPRESS_EMAIL
		}, {
			type: 'input',
			name: 'WORDPRESS_HOST_ENVIRONMENT',
			message: 'Default WordPress host environment?',
			default: this.WORDPRESS_HOST_ENVIRONMENT
		}, {
			type: 'input',
			name: 'WORDPRESS_PARENT_THEME',
			message: 'Default WordPress parent theme? ( leave blank if none )',
			default: this.WORDPRESS_PARENT_THEME
		}, {
			type: 'input',
			name: 'WORDPRESS_TABLE_PREFIX',
			message: 'WordPress table prefix',
			default: this.WORDPRESS_TABLE_PREFIX
		}, {
			type: 'input',
			name: 'WORDPRESS_TEST_DB_HOST',
			message: 'WordPress test db host',
			default: this.WORDPRESS_TEST_DB_HOST
		}, {
			type: 'input',
			name: 'WORDPRESS_THEME',
			message: 'Default WordPress theme',
			default: this.WORDPRES_THEME
		}, {
			type: 'input',
			name: 'WORDPRESS_TITLE',
			message: 'Default WordPress title?',
			default: process.cwd().split(path.sep).pop().toLowerCase()
		}, {
			type: 'input',
			name: 'WORDPRESS_VERSION',
			message: 'Default WordPress version?',
			default: this.WORDPRESS_VERSION
	}];

	this.prompt(prompts, function (props) {
		APP_ENV                    = props.APP_ENV;
		COMPOSER_HOME             = props.COMPOSER_HOME;
		COMPOSER_VENDOR_DIR        = props.COMPOSER_VENDOR_DIR;
		COMPOSER_VERSION           = props.COMPOSER_VERSION;
		DB_VERSION                 = props.DB_VERSION;
		MEMCACHED_VERSION          = props.MEMCACHED_VERSION;
		MULTISITE                  = props.MULTISITE;
		COMPOSER_CACHE_DIR         = COMPOSER_CACHE_DIR;
		MYSQL_DATABASE             = props.MYSQL_DATABASE;
		MYSQL_PASSWORD             = props.MYSQL_PASSWORD;
		MYSQL_ROOT_PASSWORD        = props.MYSQL_ROOT_PASSWORD;
		MYSQL_USER                 = props.MYSQL_USER;
		MYSQL_VOLUMES              = props.MYSQL_VOLUMES;
		NGINX_VERSION              = props.NGINX_VERSION;
		NODE_VERSION               = props.NODE_VERSION;
		ORG                        = props.ORG;
		ORG_URL                    = props.ORG_URL;
		PHPCS_STANDARD             = props.PHPCS_STANDARD;
		PHP_VERSION                = props.PHP_VERSION;
		TEXT_DOMAIN                = props.TEXT_DOMAIN;
		WEB_ROOT                   = props.WEB_ROOT;
		WORDPRESS_ADMIN_PASSWORD   = props.WORDPRESS_ADMIN_PASSWORD;
		WORDPRESS_ADMIN_USER       = props.WORDPRESS_ADMIN_USER;
		WORDPRESS_CACHE            = props.WORDPRESS_CACHE;
		WORDPRESS_DB_HOST          = props.WORDPRESS_DB_HOST;
		WORDPRESS_DB_NAME          = props.WORDPRESS_DB_NAME;
		WORDPRESS_DB_PASSWORD      = props.WORDPRESS_DB_PASSWORD;
		WORDPRESS_DB_USER          = props.WORDPRESS_DB_USER;
		WORDPRESS_DOMAIN           = props.WORDPRESS_DOMAIN;
		WORDPRESS_EMAIL            = props.WORDPRESS_EMAIL;
		WORDPRESS_HOST_ENVIRONMENT = props.WORDPRESS_HOST_ENVIRONMENT;
		WORDPRESS_PARENT_THEME     = props.WORDPRESS_PARENT_THEME;
		WORDPRESS_TABLE_PREFIX     = props.WORDPRESS_TABLE_PREFIX;
		WORDPRESS_TEST_DB_HOST     = props.WORDPRESS_TEST_DB_HOST;
		WORDPRESS_THEME            = props.WORDPRESS_THEME;
		WORDPRESS_TITLE            = props.WORDPRESS_TITLE;
		WORDPRESS_VERSION          = props.WORDPRESS_VERSION;
		done();
	}.bind(this));
}

function getDefaultTemplateData() {
	return {
		APP_ENV                    : APP_ENV,
		COMPOSER_VERSION           : COMPOSER_VERSION,
		COMPOSER_HOME           : COMPOSER_HOME,
		COMPOSER_VENDOR_DIR        : COMPOSER_VENDOR_DIR,
		COMPOSER_CACHE_DIR        : COMPOSER_CACHE_DIR,
		DB_VERSION                 : DB_VERSION,
		MEMCACHED_VERSION          : MEMCACHED_VERSION,
		MULTISITE                  : MULTISITE,
		MYSQL_DATABASE             : MYSQL_DATABASE,
		MYSQL_PASSWORD             : MYSQL_PASSWORD,
		MYSQL_ROOT_PASSWORD        : MYSQL_ROOT_PASSWORD,
		MYSQL_USER                 : MYSQL_USER,
		NGINX_VERSION              : NGINX_VERSION,
		NODE_VERSION               : NODE_VERSION,
		ORG                        : ORG,
		ORG_URL                    : ORG_URL,
		PHPCS_STANDARD             : PHPCS_STANDARD,
		PHP_VERSION                : PHP_VERSION,
		TEXT_DOMAIN                : TEXT_DOMAIN,
		MYSQL_VOLUMES              : MYSQL_VOLUMES,
		WEB_ROOT                   : WEB_ROOT,
		WORDPRESS_ADMIN_PASSWORD   : WORDPRESS_ADMIN_PASSWORD,
		WORDPRESS_ADMIN_USER       : WORDPRESS_ADMIN_USER,
		WORDPRESS_CACHE            : WORDPRESS_CACHE,
		WORDPRESS_DB_HOST          : WORDPRESS_DB_HOST,
		WORDPRESS_DB_NAME          : WORDPRESS_DB_NAME,
		WORDPRESS_DB_PASSWORD      : WORDPRESS_DB_PASSWORD,
		WORDPRESS_DB_USER          : WORDPRESS_DB_USER,
		WORDPRESS_DOMAIN           : WORDPRESS_DOMAIN,
		WORDPRESS_EMAIL            : WORDPRESS_EMAIL,
		WORDPRESS_HOST_ENVIRONMENT : WORDPRESS_HOST_ENVIRONMENT,
		WORDPRESS_PARENT_THEME     : WORDPRESS_PARENT_THEME,
		WORDPRESS_TABLE_PREFIX     : WORDPRESS_TABLE_PREFIX,
		WORDPRESS_TEST_DB_HOST     : WORDPRESS_TEST_DB_HOST,
		WORDPRESS_THEME            : WORDPRESS_THEME,
		WORDPRESS_TITLE            : WORDPRESS_TITLE,
		WORDPRESS_VERSION          : WORDPRESS_VERSION,
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
		this.log(yosay( chalk.red('PMC Docker') + ' generator!'));
	},
	askFor: showPrompts,
	writing: function () {
		this.sourceRoot(path.join(__dirname, './templates'));
		handleWp(this);
	},
	end: end
});

module.exports = DockerGenerator;