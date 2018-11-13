'use strict';
var chalk = require('chalk');
var exec = require('child_process').exec;
var os = require('os');
var path = require('path');
var process = require('process');
var uuid = require('node-uuid');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');

var PipelinesHelper = require('./pipelinesHelper.js');

// General
var buildCommand = '';
var buildCompiled = '';
var ciProvider = '';
var error = false;
var hasBuildProcess = false;
var hasPhpUnit = false;
var hasSvn = false;
var textDomain = '';

function showPrompts() {
	var done = this.async();
	var prompts = [{
		type: 'list',
		name: 'ciProvider',
		message: 'Which CI provider are you using?',
		choices: [{
			name: 'Bitbucket',
			value: 'bitbucket'
		}]
	}, {
		type: 'input',
		name: 'textDomain',
		message: 'Project text domain for WP translations',
			default: process.cwd().split(path.sep).pop().toLowerCase()
	}, {
		type: 'confirm',
		name: 'hasPhpUnit',
		message: 'Does your project already support php unit testing?',
		default: function (answers) {
			return false;
		}
	}, {
		type: 'confirm',
		name: 'hasBuildProcess',
		message: 'Does your project have a build process with Node already?',
		default: function (answers) {
			return false;
		}
	}, {
		type: 'input',
		name: 'buildCommand',
		message: 'What is the main npm build command for production/qa? i.e. npm run {prod|build}',
		default: 'build',
		when: function (answers) {
			return answers.hasBuildProcess;
		}
	}, {
		type: 'input',
		name: 'buildCompiled',
		message: 'What is the compiled assets directory for artifact caching? e.x. assets/',
		default: 'assets/**',
		when: function (answers) {
			return answers.hasBuildProcess;
		}
	}, {
		type: 'confirm',
		name: 'hasSvn',
		message: 'Does this project deploy to SVN?',
		default: false
	}];

	this.prompt(prompts, function (props) {
		ciProvider = props.ciProvider;
		buildCommand = props.buildCommand;
		buildCompiled = props.buildCompiled;
		hasBuildProcess = props.hasBuildProcess;
		hasPhpUnit = props.hasPhpUnit;
		hasSvn = props.hasSvn;
		textDomain = props.textDomain;
		done();
	}.bind(this));
}

function handlePipeline(yo) {
	var pipelines = new PipelinesHelper();
	var done = yo.async();
	var updateFiles = function() { done(); }
	var templateData = getDefaultTemplateData();

	handleCommmonTemplates(yo, pipelines, templateData, updateFiles.bind(yo));
}

function getDefaultTemplateData() {
	return {
		ciProvider: ciProvider,
		hasBuildProcess: hasBuildProcess,
		buildCommand: buildCommand,
		buildCompiled: buildCompiled,
		hasPhpUnit: hasPhpUnit,
		hasSvn: hasSvn,
		textDomain: textDomain
	}
}

function handleCommmonTemplates(yo, helper, templateData, cb) {
	yo.fs.copyTpl(
		yo.templatePath(helper.getTemplateBitbucketPipelinesFileName()),
		yo.destinationPath('bitbucket-pipelines.yml'),
		templateData
	);
	cb();
	return;
}

function end() {
	if (error) {
		this.log(chalk.red('Errors occured. Please fix them and re-run the generator.'));
		return;
	}
}


var PipelinesGenerator = yeoman.generators.Base.extend({
	constructor: function () {
		yeoman.generators.Base.apply(this, arguments);
	},

	init: function () {
	this.log(yosay( chalk.red('PMC Pipelines') + ' generator!'));
	},
	askFor: showPrompts,
	writing: function () {
		this.sourceRoot(path.join(__dirname, './templates'));
		switch (ciProvider) {
			case 'bitbucket':
				{
					handlePipeline(this);
							break;
				}
			default:
				this.log.error(':( not implemented.');
				break;
		}
	},
	end: end
});

module.exports = PipelinesGenerator;