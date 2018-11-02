'use strict'

var fs = require('fs');
var path = require('path');
var process = require('process');

var BaseHelper = function () {}

/**
* Backup said file
* @param {string} sourceFile - Source file
* @param {string} targetFile - Target file
*/
BaseHelper.prototype._backupFile = function (sourceFile, targetFile, cb) {
	fs.readFile(sourceFile, 'utf8', function (err, data) {
		if (err) {
			cb('Error reading file: ' + err);
			return;
		}
		fs.writeFile(targetFile, data, function (err) {
			if (err) {
				cb('Error writing file: ' + err);
				return;
			}
			cb(null);
			return;
		});
	});
}

module.exports = BaseHelper;