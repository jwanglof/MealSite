$(document).ready(function() {
	var ingredients;
	$.ajax({
		url: '/ingredient/getAll',
		type: 'post',
		cache: false, 
		data: {}, 
		success: function(data) {
			ingredients = data.response;
		},
		error: function(jqXHR, textStatus, err) {
			alert('text status '+textStatus+', err '+err);
		}
	});

	var numberOfIngredients = 1;
	$("#add_ingredient").on("click", function() {
		// $("#ingredients").append("<div class='form-group'><label for='ingredient_"+ numberOfIngredients +"'>Ingredient "+ numberOfIngredients +"</label><input type='text' placeholder='Ingredient "+ numberOfIngredients +"' name='ingredient' class='form-control' /></div>")

		var allIngredients;
		for (var i = 0; i < ingredients.length; i++) {
			allIngredients += "<option value='"+ ingredients[i].id +"'>"+ ingredients[i].name +"</option>";
		}

		$("#ingredients").append(" \
			<div class='form-group col-md-12' id='ingredient_"+ numberOfIngredients +"'> \
				<div class='row'> \
					<label for='ingredient_"+ numberOfIngredients +"'>Ingredient "+ numberOfIngredients +"</label> \
				</div> \
				<div class='col-md-5'> \
					<select class='form-control' name='ingredients'>"+ allIngredients +"</select> \
				</div> \
				<div class='col-md-5'> \
					<input type='number' name='weight' class='form-control' placeholder='Vikt (i gram!)' /> \
				</div> \
			</div> \
		");

		// _"+ numberOfIngredients +"
		numberOfIngredients++;
	});

	$("#remove_ingredient").on("click", function() {
		alert(22);
	});

	$(".expand_meal").on("click", function() {
		var id = $(this).parent().parent()[0].id;
		var weight = $(this).parent().parent().find(".weight").val();
		
		var meal_ingredients = $(this).parent().parent().find(".meal_ingredients");
		if (meal_ingredients.css("display") == "none") {
			$(this).text("Göm");
			meal_ingredients.css("display", "inline");
		}
		else {
			$(this).text("Visa");
			meal_ingredients.css("display", "none");
		}

		showMeal(id, weight);
	});

	$(".weight").on("keyup", function() {
		var id = $(this).closest(".ingredient")[0].id;
		var weight = $(this).val();

		var meal_ingredients = $(this).parent().parent().find(".meal_ingredients");
		if (meal_ingredients.css("display") == "none") {
			$(this).parent().parent().find(".expand_meal").text("Göm");
			meal_ingredients.css("display", "inline");
		}

		showMeal(id, weight);
	});

	function showMeal(id, weight) {
		request = $.ajax({
			type: "post",
			// url: "/ajax/mail",
			url: "/meal/get/"+ id,
			data: {id: id, weight: weight}
		});

		request.done(function(response, textStatus, jqXHR) {	
			var content = "";

			content += "<div style='font-size: 10px; padding-top: 40px; padding-bottom: 20px'>";

				content += "<div style='font-weight: 700;'>";
					content += "<div class='col-md-2'> </div>";
					content += "<div class='col-md-2'>Vikt (g)</div>";
					content += "<div class='col-md-2'>Kalorier (kcal)</div>";
					content += "<div class='col-md-2'>Protein (g)</div>";
					content += "<div class='col-md-2'>Fett (g)</div>";
					content += "<div class='col-md-2'>Kolhydrater (g)</div>";
				content += "</div>";

				content += "<div class='col-md-2' style='font-weight: 700'>Din angivna vikt:</div>";
				content += "<div class='col-md-2'>"+ weight +"</div>";
				content += "<div class='col-md-2'>"+ response["user"][1] +"</div>";
				content += "<div class='col-md-2'>"+ response["user"][2] +"</div>";
				content += "<div class='col-md-2'>"+ response["user"][3] +"</div>";
				content += "<div class='col-md-2'>"+ response["user"][4] +"</div>";

				content += "<div class='col-md-12' style='margin-top: 10px; padding-top: 10px; font-weight: 700; border-top: 1px solid #000;'>Innehållsförteckning</div>";

				for (var i = 0; i < response["ingredients"].length; i++) {
					content += "<div class='col-md-2'>"+ response["ingredients"][i][0] +"</div>";
					content += "<div class='col-md-2'>"+ response["ingredients"][i][1] +"</div>";
					content += "<div class='col-md-2'>"+ response["ingredients"][i][2] +"</div>";
					content += "<div class='col-md-2'>"+ response["ingredients"][i][3] +"</div>";
					content += "<div class='col-md-2'>"+ response["ingredients"][i][4] +"</div>";
					content += "<div class='col-md-2'>"+ response["ingredients"][i][5] +"</div>";
				}
				content += "<div style='font-weight: 700;'>";
					content += "<div class='col-md-2'>Totalt i måltid:</div>";
					content += "<div class='col-md-2'>"+ response["totals"][0] +"</div>";
					content += "<div class='col-md-2'>"+ response["totals"][1] +"</div>";
					content += "<div class='col-md-2'>"+ response["totals"][2] +"</div>";
					content += "<div class='col-md-2'>"+ response["totals"][3] +"</div>";
					content += "<div class='col-md-2'>"+ response["totals"][4] +"</div>";
				content += "</div>";

			content += "</div>";
			$("#"+ id).find(".meal_ingredients").html(content);
		});

		request.fail(function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
		});
	};
});