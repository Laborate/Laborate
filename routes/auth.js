/* Modules: Custom */
var aes   = require('../lib/aes');
var mysql = require('../lib/mysql');

/* Module Exports */
exports.login = function(req, res) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT user_id, user_name, user_password, user_pricing, user_github \
                   FROM users WHERE user_email = " + connection.escape(req.param('user_email'))

        connection.query(sql, function(err, result) {
                if(result.length == 1) {
                    if(aes.decrypt(result[0]['user_password'], req.param('user_password')) == req.param('user_password')) {
                        delete result[0]['user_password'];
                        req.session.user = result[0];
                        res.json({"success": true});
                    } else {
                        res.json({
                            "success": false,
                            "error_message": "Incorrect Email or Password"
                        });
                    }
                } else {
                   res.json({
                        "success": false,
                        "error_message": "Incorrect Email or Password"
                    });
                }

                connection.end();
            }
        );
    });
};

exports.logout = function(req, res) {
    req.session = null;
    res.redirect('/');
};

exports.register = function(req, res) {
    req.session.user = "6";
    res.json({"success": true});
};

exports.emailCheck = function(req, res) {
    if(req.param('user_email') != "1") {
        res.json({"success": true});
    } else {
        res.json({
            "success": false,
            "error_message": "Email Already Exists"
        });
    }
};

exports.restrictAccess = function(req, res, next) {
    if(!req.session.user) {
        res.redirect('/login/');
    } else {
        next();
    }
};

exports.loginCheck = function(req, res, next) {
    if(req.session.user) {
        res.redirect('/documents/');
    } else {
        next();
    }
};