'use strict';

var chalk  = require('chalk');
var yeoman = require('yeoman-generator');
var yosay  = require('yosay');

function end() {
	this.log(yosay(chalk.red('PMC yo pmc:{command}' ) + '\n You need to run a subcommand!' ));
}

var PMCGenerator = yeoman.generators.Base.extend({
	constructor: function () {
		yeoman.generators.Base.apply(this, arguments);
	},
	end: end
});

module.exports = PMCGenerator;