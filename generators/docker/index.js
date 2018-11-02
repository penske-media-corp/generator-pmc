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
var error = false;
var isMultisite = false;
var phpUnitVersion = '';
var phpVersion = '';
var wpDir = '';
var wpDomain = '';
var wpEmail = '';
var wpEnvironment = '';
var wpSlug = '';
var wpTitle = '';
var wpUserName = '';
var wpUserPass = '';
var wpVersion = '';

function showPrompts() {
	var done = this.async();
	var prompts = [{
		type: 'list',
		name: 'wpEnvironment',
		message: 'What type of WP environment are you using?',
		choices: [{
			name: 'WP VIP Go',
			value: 'wpVipGo'
		}, {
			name: 'WP VIP Classic',
			value: 'wpVipClassic'
		}, {
			name: 'WP Self Hosted',
			value: 'wpSelfHosted'
		}]
		}, {
			type: 'confirm',
			name: 'isMultisite',
			message: 'Is this a multisite install?',
			default: false
		}, {
			type: 'input',
			name: 'wpVersion',
			message: 'What version of WP are you using?',
			default: '4.9.8'
		}, {
			type: 'input',
			name: 'phpVersion',
			message: 'What version of PHP are you using?',
			default: '7.2'
		}, {
			type: 'input',
			name: 'phpUnitVersion',
			message: 'What version of PHPUnit are you using?',
			default: '6.5.7'
		}, {
			type: 'input',
			name: 'wpDomain',
			message: 'Default WP dev domain?',
			default: 'pmcdev.local'
		}, {
			type: 'input',
			name: 'wpTitle',
			message: 'Default WP title?',
			default: 'Some title'
		}, {
			type: 'input',
			name: 'wpSlug',
			message: 'Default WP slug?',
			default: process.cwd().split(path.sep).pop().toLowerCase()
		}, {
			type: 'input',
			name: 'wpEmail',
			message: 'Default WP dev email?',
			default: 'amdin@pmcdev.local'
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
			message: 'Default web dir?',
			default: '/var/www/html'
	}];

	this.prompt(prompts, function (props) {
		isMultisite = props.isMultisite;
		phpUnitVersion = props.phpUnitVersion;
		phpVersion = props.phpVersion;
		wpDir = props.wpDir;
		wpDomain = props.wpDomain;
		wpEmail = props.wpEmail;
		wpEnvironment = props.wpEnvironment;
		wpSlug = props.wpSlug;
		wpTitle = props.wpTitle;
		wpUserName = props.wpUserName;
		wpUserPass = props.wpUserPass;
		wpVersion = props.wpVersion;
		done();
	}.bind(this));
}


function getDefaultTemplateData() {
	return {
		isMultisite: isMultisite,
		phpUnitVersion: phpUnitVersion,
		phpVersion: phpVersion,
		wpDir: wpDir,
		wpDomain: wpDomain,
		wpEmail: wpEmail,
		wpEnvironment: wpEnvironment,
		wpSlug: wpSlug,
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
		return;
	}
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
		switch (wpEnvironment) {
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