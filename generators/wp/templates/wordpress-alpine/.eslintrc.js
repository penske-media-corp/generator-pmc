'use strict';

module.exports = {
	"env": {
		"browser": true,
		"commonjs": true,
		"es6": true,
		"jquery": true,
		"node": true
	},
	"parserOptions": {
		"ecmaVersion": 6,
		"ecmaFeatures": {
				"jsx": true,
				"arrowFunctions": true,
				"blockBindings": true,
				"classes": true,
				"defaultParams": true,
				"modules": true
		},
		"sourceType": "module"
	},
	"extends": [
		"eslint:recommended",
		"wordpress"
	],
	"rules": {
		"camelcase":0,
		"camel_case":0
	}
};
