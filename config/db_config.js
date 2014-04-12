var config = "local";

exports.dbConfig = function() {
    var dbInformation;

	if (config == "local")
		dbInformation = {host: "localhost", user: "root", password: "geanbe33", database: "mealz2"};
	else if (config == "jumpstarter")
		dbInformation = {host: "127.0.0.1", user: "root", password: "", database: "mealz"};
    
	return dbInformation;
}