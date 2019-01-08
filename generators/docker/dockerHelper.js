'use strict';

var os = require('os');
var path = require('path');
var process = require('process');
var BaseHelper = require('../baseHelper.js');

var DockerHelper = function () {}

DockerHelper.prototype = Object.create(BaseHelper.prototype);

DockerHelper.prototype.getTemplateDockerWp= function () {
	return 'wp';
}

module.exports = DockerHelper;