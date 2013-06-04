/* Modules: NPM */
var crypto = require('crypto');
var async = require("async");

/* Modules: Custom */
var aes   = require('../lib/core/aes');
var mysql_lib = require('../lib/mysql/users');

/* Module Exports */
exports.login = function(req, res) {
    async.series({
        user: function(callback) {
            mysql_lib.user_by_email(callback, req.param('user_email'));
        }
    }, function(error, results){
        user = results.user[0];

        if(!error && user) {
            if(aes.decrypt(user['user_password'], req.param('user_email')) == req.param('user_password')) {
                async.series([
                    function(callback) {
                        req.session.user = { id: user["user_id"] };
                        exports.reload_user(req, callback);
                    },
                    function(callback) {
                        res.json({success: true});
                        callback(null);
                    }
                ]);
            } else {
                res.json({
                    success: false,
                    error_message: "Incorrect Email or Password"
                });
            }
        } else {
           res.json({
                success: false,
                error_message: "Incorrect Email or Password"
            });
        }
    });
};

exports.logout = function(req, res) {
    req.session = null;
    res.redirect('/');
};

exports.register = function(req, res) {
    async.series({
        register: function(callback) {
            req.body.user_password = aes.encrypt(req.param('user_password'), req.param('user_email'));
            mysql_lib.user_insert(callback, req.body);
        }
    }, function(error, results){
        if(!error && results.register) {
            async.series([
                function(callback) {
                    req.session.user = { id: results.register.insertId };
                    exports.reload_user(req, callback);
                },
                function(callback) {
                    res.json({success: true});
                    callback(null);
                }
            ]);
        } else {
            res.json({
                success: false,
                error_message: "User Registration Failed"
            });
        }
    });
};

exports.reload_user = function(req, next) {
    async.series({
        user: function(callback) {
            mysql_lib.user_by_id(callback, req.session.user.id);
        }
    }, function(error, results){
        user = results.user[0];
        if(!error && user) {
            req.session.user = {
                id: user["user_id"],
                name: user["user_name"],
                screen_name: user["user_screen_name"],
                email: user["user_email"],
                email_hash: crypto.createHash('md5').update(user["user_email"]).digest("hex"),
                pricing_id: user["user_pricing"],
                pricing_documents: user["pricing_documents"],
                github: aes.decrypt(String(user["user_github"]), user["user_email"]),
                locations: JSON.parse(aes.decrypt(String(user["user_locations"]), user["user_email"]))
            };
        }
        if(next) next(error);
    });
};

exports.emailCheck = function(req, res) {
    async.series({
        userCount: function(callback) {
            mysql_lib.user_by_email_count(callback, req.param('user_email'));
        }
    }, function(error, results){
        if(!error && !results.userCount) {
            res.json({success: true});
        } else {
            res.json({
                success: false,
                error_message: "Email Already Exists"
            });
        }
    });
};

exports.restrictAccess = function(req, res, next) {
    if(req.session.user) {
        if(next) next();
    } else {
        if(req.xhr) {
            res.json({
                success: false,
                error_message: "Login Required"
            });
        } else {
            res.format({
                'text/plain': function(){
                    res.send("Login Required");
                },
                'text/html': function(){
                    res.redirect('/logout/');
                },
                'json': function(){
                    res.json({
                        success: false,
                        error_message: "Login Required"
                    });
                },
                'application/json': function(){
                    res.json({
                        success: false,
                        error_message: "Login Required"
                    });
                }
            });
        }
    }
};

exports.loginCheck = function(req, res, next) {
    if(req.session.user) {
        res.redirect('/documents/');
    } else {
        if(next) next();
    }
};
