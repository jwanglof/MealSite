var server 				= require("./server");
var router 				= require("./src/router");
var requestHandlers 	= require("./src/requestHandlers");

var handle 					= {};
handle["/"]					= requestHandlers.start;
handle["/start"]			= requestHandlers.start;
handle["/add/meal"] 		= requestHandlers.addMeal;
handle["/get/meal"]			= requestHandlers.getMeal;

server.start(router.route, handle);