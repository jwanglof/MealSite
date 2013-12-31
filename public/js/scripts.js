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
});