/**
 * Placeholder.
 *
 * @private
 * @param request
 * @param response
 * @param next
 */
function connection(request, response, next) {
	var href, ip, method, now, version;

	ip = request.connection.remoteAddress;
	method = request.method;
	now = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
	href = request.url;
	version = request.httpVersion;

	console.log('%s -- [%s] HTTP/%s %s "%s"', ip, now, version, method, href);

	next();
}


module.exports = {
	connection: connection
};
