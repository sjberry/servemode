var path = require('path');
var url = require('url');

var express = require('express');
var optionator = require('optionator');

var logging = require('../../lib/logging.js');


var argParser = optionator({
	prepend: 'Usage: servemode web [options]',
	options: [
		{
			option: 'help',
			alias: 'h',
			type: 'Boolean',
			description: 'Displays help'
		},
		/*
		{
			option: 'port',
			alias: 'p',
			type: 'Integer',
			description: 'The port on which to listen for incoming connections'
		},
		*/
		{
			option: 'settings',
			alias: 's',
			type: 'String',
			description: 'The path to the settings file'
		}
	]
});

var settings = {
	port: 5000,
	staticRoot: process.cwd(),
	scripts: [],
	styles: []
};


/**
 * Placeholder.
 *
 * @private
 * @param {String} href The path to the static file.
 * @returns {String} The full path to the static file.
 */
function _getStaticUrl(href) {
	var parsed;

	parsed = url.parse(href);

	return parsed.protocol ? href : ('/static/' + href);
}


/**
 * Loads settings from a provided file path and merges them onto the internal settings object.
 *
 * Settings file can either be in JSON format or CommonJS module format in accordance with the NodeJS `require`
 * argument requirements.
 *
 * @private
 * @param {String} filename
 */
function _loadSettings(filename) {
	var name, dir, userSettings, staticRoot;

	if (filename) {
		filename = path.resolve(filename);

		dir = path.dirname(filename);
		userSettings = require(filename);

		if (staticRoot = userSettings.staticRoot) {
			userSettings.staticRoot = path.resolve(path.join(dir, staticRoot));
		}
	}

	for (name in userSettings) {
		if (!userSettings.hasOwnProperty(name)) {
			continue;
		}

		settings[name] = userSettings[name];
	}
}


/**
 * Runs a local development server with a few simple routes and a static file server.
 *
 * @param {Array} argv An array of command line arguments.
 * @returns {*} Returns the help string if the help option flag is specified, otherwise nothing.
 */
function main(argv) {
	var app, args;

	args = argParser.parse(argv);

	if (args.help) {
		return argParser.generateHelp();
	}

	_loadSettings(args.settings);

	app = express();

	app.all('*', logging.connection);

	app.route('/')
		.get(function(request, response) {
			var i, content, url;

			content = '<DOCTYPE html><html lang="en-US"><head><meta charset="utf-8" />';

			for (i = 0; i < settings.scripts.length; i++) {
				url = _getStaticUrl(settings.scripts[i]);
				content += '<script type="text/javascript" src="' + url + '"></script>';
			}

			for (i = 0; i < settings.styles.length; i++) {
				url = _getStaticUrl(settings.styles[i]);
				content += '<link rel="stylesheet" type="text/css" href="' + url + '" />';
			}

			content += '</head><body><div id="qunit"></div><div id="qunit-fixture"></div></body></html>';

			response.send(content);
		});

	app.route('/ajax')
		.get(function(request, response) {
			response.send('Test');
		});

	app.use('/static', express.static(settings.staticRoot));

	// Run server.
	app.listen(settings.port, function() {
		console.log('Running Express web server - listening on port %d.', settings.port);
	});
}


module.exports = {
	main: main,
	persist: true
};
