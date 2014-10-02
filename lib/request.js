(function(root, factory) {
	module.exports = factory.call(root,
		require('http'),
		require('querystring'),
		require('url')
	);
})(this, function(http, querystring, url) {
	'use strict';

	var re_test_protocol = /^\S+:\/\//;


	function request(endpoint, method, data) {
		var dataString, options, parsed, req;

		if (!re_test_protocol.test(endpoint)) {
			endpoint = 'http://' + endpoint;
		}

		parsed = url.parse(endpoint);
		options = {
			host: parsed.hostname,
			port: parsed.port,
			path: parsed.pathname,
			method: method
		};

		if (method === 'GET') {
			options.path += '?' + querystring.stringify(data);
		}
		else {
			dataString = JSON.stringify(data);
			options.headers = {
				'Content-Type': 'application/json',
				'Content-Length': dataString.length
			};
		}

		req = http.request(options);

		if (dataString) {
			req.write(dataString);
		}

		req.end();

		return req;
	}

	return request;
});
