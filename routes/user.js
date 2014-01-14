
/*
 * GET users listing.
 */
var encryptionHelper	= require("encryptionhelper");

var mysql 				= require("mysql");
var connection 			= mysql.createConnection({
	host: 		"localhost",
	// user: 		"jwanglof",
	// password: 	"testtest",
	user: 		"root",
	password: 	"geanbe33",
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
	
	var meal;
	var ingredients = [];
	var ingredientsTotal = [0, 0, 0, 0, 0];
	var fkIngredients = [];
	var counterIngredients = 0;

	connection.query("SELECT * FROM meal WHERE id=? LIMIT 1", mealId, function(err, row) {
		if (err) { console.log(err); return; };
		
		meal = row[0];
		query2();
	});

	var query2 = function() {
		connection.query("SELECT fk_mi_ingredient as ingredientId, weight FROM meal_ingredient WHERE fk_mi_meal=?", mealId, function(err, rows) {
			if (err) { console.log(err); return; };
			
			fkIngredients = rows;
			query3();
		});
	};

	var query3 = function() {
		for (var i = 0; i < fkIngredients.length; i++) {
			connection.query("SELECT * FROM ingredient WHERE id=?", fkIngredients[i].ingredientId, function(err, ing) {
				if (err) { console.log(err); return; };
				
				var weight_in_meal = fkIngredients[counterIngredients].weight;
				var ingredient_weight = ing[0].weight;

				var calories 			= ing[0].calories / ingredient_weight;
				var protein 			= ing[0].protein / ingredient_weight;
				var fat 				= ing[0].fat / ingredient_weight;
				var carbohydrates 	= ing[0].carbohydrates / ingredient_weight;

				ingredientsTotal[0] += weight_in_meal;
				ingredientsTotal[1] += Math.round(calories * weight_in_meal);
				ingredientsTotal[2] += Math.round(protein * weight_in_meal);
				ingredientsTotal[3] += Math.round(fat * weight_in_meal);
				ingredientsTotal[4] += Math.round(carbohydrates * weight_in_meal);

				ingredients.push([ing[0].name, weight_in_meal, calories, protein, fat, carbohydrates]);
				counterIngredients += 1;

				// If done, call finished
				if (ingredients.length == fkIngredients.length) {
					console.log(ingredients);
					finished();
				};
			});
		};
	};

	var finished = function() {
		res.render("meal_show", { cookies: req.cookies, title: 'Visa måltid', meal: meal, ingredients: ingredients, totals: ingredientsTotal });
	};
};

exports.meal_get = function(req, res) {
	var mealId = req.body.id;
	var weight = parseInt(req.body.weight);

	var ingredients = [];
	var ingredientsTotal = [0, 0, 0, 0, 0];
	var ingredientsUser = [0, 0, 0, 0, 0];
	var fkIngredients = [];
	var counterIngredients = 0;

	connection.query("SELECT fk_mi_ingredient as ingredientId, weight FROM meal_ingredient WHERE fk_mi_meal=?", mealId, function(err, rows) {
		if (err) { console.log(err); return; };
		
		fkIngredients = rows;
		query3();
	});

	var query3 = function() {
		for (var i = 0; i < fkIngredients.length; i++) {
			connection.query("SELECT * FROM ingredient WHERE id=?", fkIngredients[i].ingredientId, function(err, ing) {
				if (err) { console.log(err); return; };
				
				var weight_in_meal = fkIngredients[counterIngredients].weight;
				var ingredient_weight = ing[0].weight;

				var calories 					= ing[0].calories / ingredient_weight;
				var protein 					= ing[0].protein / ingredient_weight;
				var fat 						= ing[0].fat / ingredient_weight;
				var carbohydrates 			= ing[0].carbohydrates / ingredient_weight;

				var caloriesInMeal 			= Math.round(calories * weight_in_meal);
				var proteinInMeal 			= Math.round(protein * weight_in_meal);
				var fatInMeal 				= Math.round(fat * weight_in_meal);
				var carbohydratesInMeal 	= Math.round(carbohydrates * weight_in_meal);

				// Add the weight to show the total weight of each ingredient
				ingredientsTotal[0] += weight_in_meal;
				ingredientsTotal[1] += caloriesInMeal;
				ingredientsTotal[2] += proteinInMeal;
				ingredientsTotal[3] += fatInMeal;
				ingredientsTotal[4] += carbohydratesInMeal;

				ingredients.push([ing[0].name, weight_in_meal, caloriesInMeal, proteinInMeal, fatInMeal, carbohydratesInMeal]);
				counterIngredients += 1;

				// If done, call finished
				if (ingredients.length == fkIngredients.length) {
					/*
						för att få ut 230 gram av 1340 så måste du ta
						1340/230 = 5.826....

						och sen om du har 400 gram protte i 1340 så blir det 
						400/5.826.. = 68.56....
					*/
					var weightRatio = ingredientsTotal[0] / weight;

					// $dbWeight = $rad['weight']/$weight;
					// round($rad['kcal']/$dbWeight, 1)

					ingredientsUser[0] = weight;
					ingredientsUser[1] = Math.round(ingredientsTotal[1] / weightRatio);
					ingredientsUser[2] = Math.round(ingredientsTotal[2]  / weightRatio);
					ingredientsUser[3] = Math.round(ingredientsTotal[3] / weightRatio);
					ingredientsUser[4] = Math.round(ingredientsTotal[4] / weightRatio);

					finished();
				};
			});
		};
	};

	var finished = function() {
		// res.render("meal_show", { cookies: req.cookies, title: 'Visa måltid', meal: meal, ingredients: ingredients, totals: ingredientsTotal });
		res.send({ ingredients: ingredients, totals: ingredientsTotal, user: ingredientsUser });
	};
};

// connection.end(function(err) {
// 	console.log("An error occured when the DB connection tried to terminate.");
// 	console.log("Error: "+ err);
// })