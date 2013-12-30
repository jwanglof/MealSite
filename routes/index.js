
/*
 * GET home page.
 */

exports.index = function(req, res){
	console.log(req.cookies.user_username);
	res.render('index', { cookies: req.cookies, title: 'Hem' });
};