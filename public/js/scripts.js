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
		var id = $(".ingredient").attr("id");

		request = $.ajax({
			type: "post",
			// url: "/ajax/mail",
			url: "/meal/get/"+ id,
			data: {id: id}
		});

		request.done(function(response, textStatus, jqXHR) {
			
			var content = "";

			content += "<div class='col-md-12'>Vikt: <input type='number' name='weight'></select></div>";

			content += "<div style='font-size: 10px; padding-top: 40px'>"

			content += "<div style='font-weight: 700;'>";
				content += "<div class='col-md-2'>Ingrediensnamn</div>";
				content += "<div class='col-md-2'>Vikt (g)</div>";
				content += "<div class='col-md-2'>Kalorier (kcal)</div>";
				content += "<div class='col-md-2'>Protein (g)</div>";
				content += "<div class='col-md-2'>Fett (g)</div>";
				content += "<div class='col-md-2'>Kolhydrater (g)</div>";
			content += "</div>";

			for (var i = 0; i < response["ingredients"].length; i++) {
				content += "<div class='col-md-2'>"+ response["ingredients"][i][0] +"</div>";
				content += "<div class='col-md-2'>"+ response["ingredients"][i][1] +"</div>";
				content += "<div class='col-md-2'>"+ response["ingredients"][i][2] +"</div>";
				content += "<div class='col-md-2'>"+ response["ingredients"][i][3] +"</div>";
				content += "<div class='col-md-2'>"+ response["ingredients"][i][4] +"</div>";
				content += "<div class='col-md-2'>"+ response["ingredients"][i][5] +"</div>";
			}
			content += "<div style='font-weight: 700;'>";
				content += "<div class='col-md-2'>Totalt</div>";
				content += "<div class='col-md-2'>"+ response["totals"][0] +"</div>";
				content += "<div class='col-md-2'>"+ response["totals"][1] +"</div>";
				content += "<div class='col-md-2'>"+ response["totals"][2] +"</div>";
				content += "<div class='col-md-2'>"+ response["totals"][3] +"</div>";
				content += "<div class='col-md-2'>"+ response["totals"][4] +"</div>";
			content += "</div>";

			content += "</div>";
			/*
		div.col-md-2 Totalt
		div.col-md-2
			= totals[0]
		div.col-md-2
			= totals[1]
		div.col-md-2
			= totals[2]
		div.col-md-2
			= totals[3]
		div.col-md-2
			= totals[4]
		div.col-md-2
			= totals[5]
			*/

			$("#"+ id).find(".meal_ingredients").html(content);

			// $("#requestCityModal").find(".modal-body").html("Tack för ditt mail. Vi på StudentTrade.se kollar på det så snabbt vi bara kan!");
		});

		request.fail(function(jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
		});
	})
});