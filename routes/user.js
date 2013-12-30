
/*
 * GET users listing.
 */
var encryptionHelper	= require("encryptionhelper");

var mysql 				= require("mysql");
var connection 			= mysql.createConnection({
	host: 		"localhost",
	user: 		"jwanglof",
	password: 	"testtest",
	database: 	"mealz"
});

exports.ingredients = function(req, res) {
	connection.query("SELECT * FROM ingredient", function(err, rows) {
		if (err) { console.log(err); }
		res.render("ingredients", { title: "Ingredients", ingredients: rows });
	});
};

exports.login = function(req, res) {
	var encryptedPassword = encryptionHelper.hash(req.body.password, "sha1");

	connection.query("SELECT username,password,admin FROM user WHERE username=?", req.body.username, function(err, row) {
		if (err) { console.log(err); }

		if (row[0]["password"] == encryptedPassword) {
			req.session.admin = row[0]["admin"];
			req.session.user = row[0]["username"];
			console.log(req.session);
			res.send("Correct password");
		} else {
			res.send("Incorrect password");
		}
	});
};

// connection.end(function(err) {
// 	console.log("An error occured when the DB connection tried to terminate.");
// 	console.log("Error: "+ err);
// })