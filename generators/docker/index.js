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
var provisioner = false;
var wpDir = '/var/www/html';
var wpDomain = '';
var wpEmail = '';
var wpEnvironment = '';
var wpSlug = '';
var wpTheme = '';
var wpTitle = '';
var wpUserName = '';
var wpUserPass = '';

function showPrompts() {
	var done = this.async();
	var prompts = [{
		type: 'list',
		name: 'wpEnvironment',
		message: 'WP environment?',
		choices: [{
			name: 'WP VIP Go',
			value: 'wpVipGo'
		}]
		}, {
			type: 'input',
			name: 'wpDomain',
			message: 'Default WP dev domain?',
			default: 'pmcdev.local'
		}, {
			type: 'input',
			name: 'wpTheme',
			message: 'Default WP theme?',
			default: process.cwd().split(path.sep).pop().toLowerCase()
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
			type: 'confirm',
			name: 'provisioner',
			message: 'Does this use the provisioner container?',
			default: ''
	}];

	this.prompt(prompts, function (props) {
		provisioner = props.provisioner;
		wpDomain = props.wpDomain;
		wpEmail = props.wpEmail;
		wpEnvironment = props.wpEnvironment;
		wpSlug = props.wpSlug;
		wpTheme = props.wpTheme;
		wpTitle = props.wpTitle;
		wpUserName = props.wpUserName;
		wpUserPass = props.wpUserPass;
		done();
	}.bind(this));
}


function getDefaultTemplateData() {
	return {
		provisioner: provisioner,
		wpDir: wpDir,
		wpDomain: wpDomain,
		wpEmail: wpEmail,
		wpEnvironment: wpEnvironment,
		wpSlug: wpSlug,
		wpTheme: wpTheme,
		wpTitle: wpTitle,
		wpUserName: wpUserName,
		wpUserPass: wpUserPass
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