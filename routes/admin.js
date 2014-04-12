var encryptionHelper	= require("encryptionhelper");
var dbConfig 			= require('../config/db_config');
var mysql 				= require("mysql");
var connection 			= mysql.createConnection(dbConfig.dbConfig());
var queues = require('mysql-queues');
const DEBUG = true;
queues(connection, DEBUG);

exports.add_user = function(req, res) {
	if (req.params.command == "add")
		res.render("admin_add_user", { cookies: req.cookies });
	else if (req.params.command == "finish") {
		var encryptedPassword = encryptionHelper.hash(req.body.password, "sha1");

		var postInputs = {username: req.body.username, password: encryptedPassword, name: req.body.name, admin: req.body.admin};
		var success = true;

		var trans = connection.startTransaction();

		trans.query("INSERT INTO user SET ?", postInputs, function(err, info) {
			if (err) {
				console.log(err);
				success = false;
				trans.rollback();
			}
			else {
				trans.commit();
			}
		});

		trans.execute();
		res.redirect("/admin/user/add");
	}
};