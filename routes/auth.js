/* Modules: Custom */
var aes   = require('../lib/aes');
var mysql_lib = require('../lib/users_mysql_lib');
var sequence = require("futures").sequence();
var crypto = require('crypto');

/* Module Exports */
exports.login = function(req, res) {
    sequence
        .then(function(next) {
            mysql_lib.user_by_email(next, req.param('user_email'));
        })
        .then(function(next, user) {
            if(user) {
                if(aes.decrypt(user[0]['user_password'], req.param('user_password')) == req.param('user_password')) {
                    req.session.user = {
                        id: user[0]["user_id"],
                        name: user[0]["user_name"],
                        screen_name: user[0]["user_screen_name"],
                        email: user[0]["user_email"],
                        email_hash: crypto.createHash('md5').update(user[0]["user_email"]).digest("hex"),
                        pricing_id: user[0]["user_pricing"],
                        pricing_documents: user[0]["pricing_documents"],
                        github: user[0]["user_github"]
                    };

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
            next();
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