
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
var queues = require('mysql-queues');
const DEBUG = true;
queues(connection, DEBUG);

exports.meals = function(req, res) {
	connection.query("SELECT * FROM meal", function(err, rows) {
		if (err) { console.log(err); }

		res.render('meals', { cookies: req.cookies, title: 'Måltider', meals: rows });
	});
};

exports.ingredients = function(req, res) {
	connection.query("SELECT * FROM ingredient", function(err, rows) {
		if (err) { console.log(err); }
		
		res.render("ingredients", { cookies: req.cookies, title: "Ingredienser", ingredients: rows });
	});
};

exports.login = function(req, res) {
	var encryptedPassword = encryptionHelper.hash(req.body.password, "sha1");

	connection.query("SELECT id,username,password,admin FROM user WHERE username=?", req.body.username, function(err, row) {
		if (err) { console.log(err); }

		if (row && row[0]["password"] == encryptedPassword) {
			var hour = 60 * 60 * 1000;
			res.cookie("user_username", row[0]["username"], { maxAge: hour });
			res.cookie("user_admin", row[0]["admin"], { maxAge: hour });
			res.cookie("user_id", row[0]["id"], { maxAge: hour });

			res.redirect("/");
		} else {
			res.redirect("/");
		}
	});
};

exports.logout = function(req, res) {
	res.clearCookie("user_username");
	res.clearCookie("user_admin");
	res.clearCookie("user_id");

	res.redirect("/");
}

exports.ingredient_form = function(req, res) {
	connection.query("SELECT * FROM ingredient_type", function(err, row) {
		res.render("ingredient_form", { cookies: req.cookies, title: 'Lägg till ingredient', types: row });
	});
};

exports.ingredient_add = function(req, res) {
	var postInputs = {name: req.body.name, weight: req.body.weight, calories: req.body.calories, 
						protein: req.body.protein, carbohydrates: req.body.carbohydrates, fat: req.body.fat,
						fk_ingredient_ingredientType: req.body.type};

	connection.query("INSERT INTO ingredient SET ?", postInputs, function(err, result) {
		if (err) throw err;

		// console.log(result.insertId);
		res.redirect("/ingredients");
	});
};

exports.ingredient_getAll = function(req, res) {
	connection.query("SELECT id,name,fk_ingredient_ingredientType FROM ingredient", function(err, rows) {
		if (err) { console.log(err); }
		
		res.contentType("json");
		res.write(JSON.stringify({response: rows}));
		res.end();
	});
}

exports.meal_form = function(req, res) {
	res.render("meal_form", { cookies: req.cookies, title: 'Lägg till måltid' });
};

exports.meal_add = function(req, res) {
	var postInputs = {name: req.body.name, description: req.body.description, fk_meal_user: req.cookies.user_id};
	var success = true;

	var trans = connection.startTransaction();

	trans.query("INSERT INTO meal SET ?", postInputs, function(err, info) {
		if (err) {
			success = false;
			trans.rollback();
		}
		else {
			if (req.body.ingredients.length != undefined) {
				for(var i = 0; i < req.body.ingredients.length; i++) {
					var mealIngredient = {fk_mi_meal: info.insertId, fk_mi_ingredient: req.body.ingredients[i], weight: req.body.weight[i]};
					trans.query("INSERT INTO meal_ingredient SET ?", mealIngredient, function(err, dsa) {
						if (err) {
							success = false;
							trans.rollback();
						}
					});
				}
			}
			trans.commit();
		}
	});

	trans.execute();

	if (success)
		res.redirect("/");
};

exports.meal_show = function(req, res) {
	var mealId = req.params["id"];

	var ingredients = {};

	connection.query("SELECT * FROM meal WHERE id=? LIMIT 1", mealId, function(err, row) {
		if (err) { console.log(err); }
		else {
			connection.query("SELECT fk_mi_ingredient as ingredientId, weight FROM meal_ingredient WHERE fk_mi_meal=?", mealId, function(err, rows) {

				// res.render("meal_show", { cookies: req.cookies, title: 'Visa måltid', meal: row[0] });
			})
		}
	});
};

// connection.end(function(err) {
// 	console.log("An error occured when the DB connection tried to terminate.");
// 	console.log("Error: "+ err);
// })