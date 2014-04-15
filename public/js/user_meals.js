$(document).ready(function() {
  $(".my_meals.edit").on("click", function() {
    var id = $(this).closest(".row")[0].id;
  });

  $(".my_meals.private").on("click", function() {
    var id = $(this).closest(".row")[0].id;
    var oThis = $(this);

    request = $.ajax({
      type: "post",
      url: "/user/meal/private/"+ id,
      data: {id: id}
    });

    request.done(function(response, textStatus, jqXHR) {
      // response:
      // 0 = private off
      // 1 = private on
      if ( response[0] && response[1] == 0 ) {
        oThis.removeClass("glyphicon-off").addClass("glyphicon-ban-circle");
        // alert("Din måltid är nu privat och kommer inte synas för andra användare.")
      } else if ( response[0] && response[1] == 1 ) {
        oThis.removeClass("glyphicon-ban-circle").addClass("glyphicon-off");
      } else {
        console.log(33333);
        // alert("Något gick fel. Din måltid är INTE privat.");
      }
    });
  });

  $(".my_meals.remove").on("click", function() {
    var id = $(this).closest(".row")[0].id;
    var oThis = $(this);
    
    request = $.ajax({
      type: "post",
      url: "/user/meal/remove/"+ id,
      data: {id: id}
    });

    request.done(function(response, textStatus, jqXHR) {
      if ( response ) {
        oThis.closest(".row").remove()
      } else if ( !response ) {
        alert("Något gick fel. Din måltid är INTE borttagen!");
      }
    });
  });
});