var http 		= require("http");
var url 		= require("url");
var logger 		= require("./src/logger.js");

function start(route, handle) {
	function onRequest(request, response) {
		var postData = "";
		var pathname = url.parse(request.url).pathname;

		logger.regular("Request for "+ pathname +" received.");

		route(handle, pathname, response, request);
	}

	http.createServer(onRequest).listen(8888);

	logger.regular("Server has started");
}

exports.start 		= start;