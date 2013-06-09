/* Modules: NPM */
var crypto = require('crypto');
var async = require("async");
var uuid = require('node-uuid');

/* Modules: Custom */
var config   = require('../config');
var core   = require('./core');
var error_lib   = require('./error');
var aes   = require('../lib/core/aes');
var user_mysql = require('../lib/mysql/users');

/* Module Exports */
exports.login = function(req, res, next) {
    async.series({
        user: function(callback) {
            user_mysql.user_by_email(callback, req.param('user_email'));
        }
    }, function(error, results){
        user = results.user[0];

        if(!error && user) {
            if(aes.decrypt(user['user_password'], req.param('user_email')) == req.param('user_password')) {
                async.series([
                    function(callback) {
                        req.session.user = { id: user["user_id"] };
                        exports.reload_user(req, res, callback);
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
            delete req.body._csrf;
            req.body.user_password = aes.encrypt(req.param('user_password'), req.param('user_email'));
            user_mysql.user_insert(callback, req.body);
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

exports.reload_user = function(req, res, next) {
    async.series({
        user: function(callback) {
            user_mysql.user_by_id(callback, req.session.user.id);
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
                github: aes.decrypt(String(user["user_github"]), user["user_email"]),
                code_pricing_id: user["user_code_pricing"],
                code_pricing_documents: user["pricing_documents"],
                code_locations: JSON.parse(aes.decrypt(String(user["user_locations"]), user["user_email"]))
            };

            var user_uuid = uuid.v1();
            user_mysql.user_insert_recovery(user["user_id"], user_uuid);
            res.cookie(config.cookies.rememberme, user_uuid, { maxAge: 9000000000 });
        }
        if(next) next(error);
    });
};

exports.emailCheck = function(req, res) {
    async.series({
        userCount: function(callback) {
            user_mysql.user_by_email_count(callback, req.param('user_email'));
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
        async.series({
            uuid: function(callback) {
                user_mysql.user_by_uuid(callback, req.cookies[config.cookies.rememberme]);
            }
        }, function(error, result) {
            if(!error && result.uuid.length) {
                req.session.user = { id: result.uuid[0]["recovery_user_id"] };
                exports.reload_user(req, res, next);
            } else {
                error_lib.handler({status: 401}, req, res, next);
            }
        });
    }
};

exports.loginCheck = function(req, res, next) {
    if(req.session.user) {
        res.redirect('/documents/');
    } else {
        if(next) next();
    }
};
