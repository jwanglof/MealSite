var config = "local";

exports.dbConfig = function() {
	var returnValue;

	if (config == "local")
		returnValue = {host: "localhost", user: "root", password: "geanbe33", database: "mealz"};
	else if (config == "jumpstarter")
		returnValue = {host: "127.0.0.1", user: "root", password: "", database: "mealz"};

	return returnValue;
}