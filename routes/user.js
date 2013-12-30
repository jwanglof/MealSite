
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
		res.render("ingredients", { cookies: req.cookies, title: "Ingredienser", ingredients: rows });
	});
};

exports.login = function(req, res) {
	var encryptedPassword = encryptionHelper.hash(req.body.password, "sha1");

	connection.query("SELECT username,password,admin FROM user WHERE username=?", req.body.username, function(err, row) {
		if (err) { console.log(err); }

		if (row[0]["password"] == encryptedPassword) {
			// req.session.admin = row[0]["admin"];
			// req.session.user = row[0]["username"];
			var hour = 60 * 60 * 1000;
			res.cookie("user_username", row[0]["username"], { maxAge: hour });
			res.cookie("user_admin", row[0]["admin"], { maxAge: hour });

			// console.log(req.session);
			// res.send("Correct password");
			res.redirect("/");
		} else {
			res.redirect("/");
		}
	});
};

exports.ingredient_form = function(req, res) {
	res.render("ingredient_form", { cookies: req.cookies, title: 'Lägg till ingredient' });
}
exports.ingredient_add = function(req, res) {
	res.send("HIHI");
}

exports.meal_form = function(req, res) {
	res.render("meal_form", { cookies: req.cookies, title: 'Lägg till måltid' });
}
exports.meal_add = function(req, res) {
	res.send("HIHI");
}


// connection.end(function(err) {
// 	console.log("An error occured when the DB connection tried to terminate.");
// 	console.log("Error: "+ err);
// })