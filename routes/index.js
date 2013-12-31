
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', { cookies: req.cookies, title: 'Hem' });
};