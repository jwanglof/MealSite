var querystring 	= require("querystring");
var fs 				= require("fs");
var formidable 		= require("formidable");

function requestLogMsg(fromFunc) {
	return console.log("Request-handler '"+ fromFunc +"' was called");
}

function start(response) {
	requestLogMsg("start");

	var content = "empty";

	var body 	= "<html>"+
					"<head></head>"+
					"<body>"+
					"<form action='/upload' method='post' enctype='multipart/form-data'>"+
					"<input type='file' name='upload'>"+
					"<input type='submit' value='Submit form' />"+
					"</form>"+
					"</body>"+
					"</html>";

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write(body);
	response.end();
}

function upload(response, request) {
	requestLogMsg("upload");

	var form = new formidable.IncomingForm();
	console.log("About to parse");

	form.parse(request, function(error, fields, files) {
		console.log("Parsing done.");

		fs.rename(files.upload.path, "/tmp/test.png", function(error) {
			if (error) {
				fs.unlink("/tmp/test.png");
				fs.rename(files.upload.path, "/tmp/test.png");
			}
		});

		response.writeHead(200, {"Content-Type": "text/html"});
		response.write("Received image: <br />");
		response.write("<img src='/show' />");
		response.end();
	});
}

function show(response) {
	requestLogMsg("show");

	response.writeHead(200, {"Content-Type": "image/png"});
	fs.createReadStream("/tmp/test.png").pipe(response);
}

exports.start 		= start;
exports.upload 		= upload;
exports.show 		= show;