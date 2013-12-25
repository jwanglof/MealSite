"use strict";

var logger 			= require("./logger");
var mysql 			= require("mysql");

var connection = mysql.createConnection({
	host: 		"localhost",
	user: 		"jwanglof",
	password: 	"testtest",
	database: 	"meal"
});

function reqCalled(req) {
	logger.regular("Request-handler '"+ req +"' was called");
}

function start(response) {
	reqCalled("start");

	response.writeHead(200, {"Content-Type": "text/html"});
	response.write("Ello Start");
	response.end();
}

function getMeal(response) {
	reqCalled("getMeal");

	var query = connection.query("SELECT * FROM meal");

	query.on("error", function(err) {
		logger.error("A database error occured.");
		logger.error(err);
	});

	query.on("fields", function(fields) {
		logger.regular("Recieved fields information.");
	});

	query.on("result", function(result) {
		logger.regular("Recieved result:");
		response.writeHead(200, {"Content-Type": "text/html"});
		response.write(result);
		response.end();
	})

	query.on("end", function() {
		logger.regular("Query execution has finished.");
		connection.end();
	})
}

function addMeal(response) {
	reqCalled("addMeal");

	response.write("Add meal");
	response.end();
}

exports.start 		= start;
exports.addMeal 	= addMeal;
exports.getMeal 	= getMeal;