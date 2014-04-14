
/**
 * Module dependencies.
 */

var express 			= require('express');
var http 			= require('http');
var path 			= require('path');

var routes 			= require('./routes');
var user 			= require('./routes/user');
var admin			= require("./routes/admin");

var app 			= express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.configure('development', function () { app.locals.pretty = true; });
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('ezp0TQRSmsZ0RmT'));
app.use(express.session({secret: 's2xi4yIsdN56Ae1rRtDmUkEQysmmnqGabYUXlqnoq0e4B7NUS2KAndZJEADsU1R'}));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// app.get('/', routes.index);
app.get("/", user.meals);
app.get("/ingredients", user.ingredients);
app.post("/login", user.login);
app.get("/logout", user.logout);

app.get("/ingredient/form", user.ingredient_form);
app.post("/ingredient/add", user.ingredient_add);
app.post("/ingredient/getAll", user.ingredient_getAll);
app.post("/ingredient/get/:id", user.ingredient_get);

app.get("/meal/form", user.meal_form);
app.post("/meal/add", user.meal_add);
app.get("/meal/show/:id", user.meal_show);
app.post("/meal/get/:id", user.meal_get);

app.get("/user/info", user.user_info);
app.post("/user/info/edit", user.user_info_edit);
app.get("/user/meals", user.user_meals);

app.all("/admin/user/:command", admin.add_user);

app.use(function(req, res) {
	res.status(404);

	res.render("404", { cookies: req.cookies, title: 'Fel' });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
