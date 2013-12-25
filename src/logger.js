var DEBUG = true;
function debug(message) {
	if (DEBUG)
		return console.log("DEBUG # "+ message);
}

var MESSAGE = true;
function regular(message) {
	if (MESSAGE)
		return console.log("REGULAR # "+ message);
}

var ERROR = true;
function error(message) {
	if (ERROR)
		return console.log("ERROR # "+ message);
}

exports.debug 		= debug;
exports.regular 	= regular;
exports.error 		= error;