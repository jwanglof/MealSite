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
			console.log(ingredients[i]);
			allIngredients += "<option value='"+ ingredients[i].id +"'>"+ ingredients[i].name +" ("+ ingredients[i].producer +")</option>";
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

	$(".ingredientWeight").on("keyup", function() {
    var id = $(this).closest(".ingredient")[0].id;
    var weight = $(this).val();

    show_ingredient(id, weight);
  });

  function show_ingredient(id, weight) {
  	request = $.ajax({
  		type: "post",
  		url: "/ingredient/get/"+ id,
  		data: {id: id, weight: weight}
  	});

  	request.done(function(response, textStatus, jqXHR) {
  		console.log(response);
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
        content += "<div class='col-md-2'>"+ response["totals"][1] +"</div>";
        content += "<div class='col-md-2'>"+ response["totals"][2] +"</div>";
        content += "<div class='col-md-2'>"+ response["totals"][3] +"</div>";
        content += "<div class='col-md-2'>"+ response["totals"][4] +"</div>";

      content += "</div>";
      $("#"+ id).find(".ingredient_count").html(content);
  	});
  }
});