var path = require('path');

var loopback = require('loopback');
var optionator = require('optionator');

var logging = require('../../lib/logging.js');


var argParser = optionator({
	prepend: 'Usage: servemode api [options]',
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
	port: 3000,
	models: []
};


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
	var name, userSettings;

	if (filename) {
		filename = path.resolve(filename);

		userSettings = require(filename);
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
	var i, app, args, ds;

	args = argParser.parse(argv);

	if (args.help) {
		return argParser.generateHelp();
	}

	_loadSettings(args.settings);

	app = loopback();
	ds = loopback.createDataSource('memory');

	for (i = 0; i < settings.models.length; i++) {
		app.model(ds.createModel(settings.models[i]));
	}

	app.all('*', logging.connection);

	app.route('/').get(function(request, response) {
		var data;

		data = {
			models: settings.models
		};

		response.json(data);
	});

	app.use(loopback.rest());

	app.listen(settings.port, function() {
		console.log('Running LoopBack API server - listening on port %d.', settings.port);
	});
}


module.exports = {
	main: main,
	persist: true
};
