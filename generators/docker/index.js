'use strict';
var chalk = require('chalk');
var exec = require('child_process').exec;
var os = require('os');
var path = require('path');
var process = require('process');
var uuid = require('node-uuid');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var DockerHelper = require('./dockerHelper.js');

// General
var buildCommand = '';
var buildCompiledDir = '';
var buildDir = '';
var error = false;
var textDomain = '';
var wpComposerType = '';
var wpDbHost = '';
var wpDbName = '';
var wpDbPass = '';
var wpDbUser = '';
var wpDir = '';
var wpDomain = '';
var wpEmail = '';
var wpHasBuild = '';
var wpHasCoreV2 = '';
var wpHasSvnDeploy = '';
var wpHasTests = '';
var wpHostType = '';
var wpSlug = '';
var wpTheme = '';
var wpTitle = '';
var wpUserName = '';
var wpUserPass = '';
var wpVersion = '';

function showPrompts() {
	var done = this.async();
	var prompts = [{
		type: 'list',
		name: 'wpHostType',
		message: 'WP production host environment?',
		choices: [{
			name: 'WP VIP Go',
			value: 'wpVipGo'
		}]
		}, {
		type: 'list',
		name: 'wpComposerType',
		message: 'WP composer package type?',
		choices: [{
				name: 'Theme',
				value: 'wordpress-theme'
			}, {
				name: 'Plugin',
				value: 'wordpress-plugin'
			}, {
				name: 'MU plugin',
				value: 'wordpress-mu-plugin'
			}]
		}, {
			type: 'input',
			name: 'wpDomain',
			message: 'Default WP dev domain?',
			default: process.cwd().split(path.sep).pop().toLowerCase() + '.pmcdev.local'
		}, {
			type: 'input',
			name: 'wpVersion',
			message: 'Default WP version',
			default: '5.0'
		}, {
			type: 'input',
			name: 'wpTheme',
			message: 'Default WP theme?',
			default: 'vip/' + process.cwd().split(path.sep).pop().toLowerCase()
		}, {
			type: 'input',
			name: 'wpTitle',
			message: 'Default WP title?',
			default: 'PMC LOCAL ' + process.cwd().split(path.sep).pop().toLowerCase()
		}, {
			type: 'input',
			name: 'wpSlug',
			message: 'Default WP theme slug?',
			default: process.cwd().split(path.sep).pop().toLowerCase()
		}, {
			type: 'input',
			name: 'wpEmail',
			message: 'Default WP dev email?',
			default: 'dist.dev@pmc.com'
		}, {
			type: 'input',
			name: 'wpDbHost',
			message: 'Default WP host?',
			default: 'mysql'
		}, {
			type: 'input',
			name: 'wpDbUser',
			message: 'Default WP DB user?',
			default: 'wp'
		}, {
			type: 'input',
			name: 'wpDbPass',
			message: 'Default WP DB pass?',
			default: 'wp'
		}, {
			type: 'input',
			name: 'wpUserName',
			message: 'Default WP username?',
			default: 'wp'
		}, {
			type: 'input',
			name: 'wpUserPass',
			message: 'Default WP pass?',
			default: 'wp'
	}, {
			type: 'input',
			name: 'wpDir',
			message: 'Default web root?',
			default: '/var/www/html'
	}, {
			type: 'input',
			name: 'wpDbName',
			message: 'Default DB name?',
			default: 'wordpress'
	}, {
		type: 'confirm',
		name: 'wpHasCoreV2',
		message: 'Does this theme use pmc-core-v2',
		default: function (answers) {
			return true;
		}
	}, {
		type: 'confirm',
		name: 'wpHasBuild',
		message: 'Does WP have build support?',
		default: function (answers) {
			return true;
		}
	}, {
		type: 'confirm',
		name: 'wpHasTests',
		message: 'Does WP have test support?',
		default: function (answers) {
			return true;
		}
	}, {
		type: 'confirm',
		name: 'wpHasSvnDeploy',
		message: 'Does WP have SVN repository on WPCOM?',
		default: function (answers) {
			return false;
		}
	}, {
		type: 'input',
		name: 'textDomain',
		message: 'Project text domain for WP translations',
			default: process.cwd().split(path.sep).pop().toLowerCase()
	}, {
		type: 'input',
		name: 'buildCommand',
		message: 'What is the main npm build command for production/qa? i.e. npm run {prod|build}',
		default: 'build',
		when: function (answers) {
			return answers.wpHasBuild;
		}
	}, {
		type: 'input',
		name: 'buildCompiledDir',
		message: 'What is the compiled assets directory for artifact caching? e.x. assets/',
		default: 'assets/**',
		when: function (answers) {
			return answers.wpHasBuild;
		}
	}, {
		type: 'input',
		name: 'buildDir',
		message: 'What is the directory of your package file if not in root?',
		default: false,
		when: function (answers) {
			return answers.wpHasBuild;
		}
	}];

	this.prompt(prompts, function (props) {
		buildCommand = props.buildCommand;
		buildCompiledDir = props.buildCompiledDir;
		wpComposerType = props.wpComposerType;
		wpDbHost = props.wpDbHost;
		wpDbName = props.wpDbName;
		wpDbPass = props.wpDbPass;
		wpDbUser = props.wpDbUser;
		wpDir = props.wpDir;
		wpDomain = props.wpDomain;
		textDomain = props.textDomain;
		wpEmail = props.wpEmail;
		wpHasBuild = props.wpHasBuild;
		wpHasCoreV2 = props.wpHasCoreV2;
		wpHasSvnDeploy = props.wpHasSvnDeploy;
		wpHasTests = props.wpHasTests;
		wpHostType = props.wpHostType;
		wpSlug = props.wpSlug;
		wpTheme = props.wpTheme;
		wpTitle = props.wpTitle;
		wpUserName = props.wpUserName;
		wpUserPass = props.wpUserPass;
		wpVersion = props.wpVersion;
		done();
	}.bind(this));
}


function getDefaultTemplateData() {
	return {
		buildCommand: buildCommand,
		buildCompiledDir: buildCompiledDir,
		buildDir: buildDir,
		wpComposerType: wpComposerType,
		wpDbHost: wpDbHost,
		wpDbName: wpDbName,
		wpDbPass: wpDbPass,
		wpDbUser: wpDbUser,
		wpDir: wpDir,
		wpDomain: wpDomain,
		textDomain: textDomain,
		wpEmail: wpEmail,
		wpHasBuild: wpHasBuild,
		wpHasCoreV2: wpHasCoreV2,
		wpHasSvnDeploy: wpHasSvnDeploy,
		wpHasTests: wpHasTests,
		wpHostType: wpHostType,
		wpSlug: wpSlug,
		wpTheme: wpTheme,
		wpTitle: wpTitle,
		wpUserName: wpUserName,
		wpUserPass: wpUserPass,
		wpVersion: wpVersion
	};
}

function handleCommmonTemplates(yo, helper, templateData, cb) {
	yo.fs.copyTpl(
		yo.templatePath(helper.getTemplateDockerWpVipGo()),
		yo.destinationPath('.'),
		templateData
	);
	cb();
	return;
}

function handleVipGo(yo) {
	var docker = new DockerHelper();
	var done = yo.async();
	var templateData = getDefaultTemplateData();

	handleCommmonTemplates(yo, docker, templateData, done.bind(yo));
}

function end() {
	if (error) {
		this.log(chalk.red('Errors occured. Please fix them and re-run the generator.'));
	} else {
		this.log("Don't forget to check your configuration and ensure all dependencies are configured correctly.");
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
		switch (wpHostType) {
			case 'wpVipGo':
				{
					handleVipGo(this);
					break;
				}
			default:
				this.log.error(':( not implemented.');
				break;
		}
	},
	end: end
});

module.exports = DockerGenerator;