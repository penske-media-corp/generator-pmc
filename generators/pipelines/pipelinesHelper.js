'use strict'

var os  = require('os');
var path = require('path');
var process = require('process');
var BaseHelper = require('../baseHelper.js');

var PipelinesHelper = function () {}

PipelinesHelper.prototype = Object.create(BaseHelper.prototype);

/**
 * Gets the template bitbucket-pipelines file name.
 * @returns {string}
 */
PipelinesHelper.prototype.getTemplateBitbucketPipelinesFileName = function () {
    return 'bitbucket/bitbucket-pipelines.yml';
}

module.exports = PipelinesHelper;