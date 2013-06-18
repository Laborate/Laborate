/* Modules: NPM */
var crypto = require('crypto');
var async = require("async");
var uuid = require('node-uuid');
var rand = require("generate-key");

/* Modules: Custom */
var core = require('./core');
var error_lib = require('./error');
var aes = require('../lib/core/aes');
var email = require('../lib/email');
var user_mysql = require('../lib/mysql/users');

/* Module Exports: Access Checks */
exports.restrictAccess = function(req, res, next) {
    if(req.session.user) {
        if(config.cookies.rememberme in req.cookies) {
            excuse_links = ["/verify/", "/verify/resend/", "/auth/verify/"];
            if(req.session.user.verified && excuse_links.indexOf(req.url) == -1) {
                res.redirect("/verify/");
            } else {
                if(next) next();
            }
        } else {
            exports.load_user(req, res, next);
        }
    } else {
        async.series({
            uuid: function(callback) {
                user_mysql.user_by_uuid(req.cookies[config.cookies.rememberme], callback);
            }
        }, function(error, result) {
            if(!error && result.uuid.length) {
                req.session.user = { id: result.uuid[0]["recovery_user_id"] };
                exports.load_user(req, res, next);
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
        if(config.cookies.rememberme in req.cookies) {
            async.series({
                uuid: function(callback) {
                    user_mysql.user_by_uuid(req.cookies[config.cookies.rememberme], callback);
                }
            }, function(error, result) {
                if(!error && result.uuid.length) {
                    req.session.user = { id: result.uuid[0]["recovery_user_id"] };
                    exports.load_user(req, res, next);
                } else {
                    if(next) next();
                }
            });
        } else {
            if(next) next();
        }
    }
};

/* Module Exports: Access Operations */
exports.login = function(req, res, next) {
    models.USERS.find({
        where: {
            email: req.param('email'),
            password: aes.encrypt(req.param('password'), req.param('password'))
        },
        include: [{
            model: models.USERS_PRICING,
            as: 'pricing'
        }]
    }).success(function(user) {
        if(user) {
            user.updateAttributes({
                recovery: uuid.v4()
            });

            req.session.user = user.values;

            res.cookie(config.cookies.rememberme, user.recovery, {
                maxAge: 9000000000,
                httpOnly: true
            });

            res.json({
                success: false,
                error_message: "Incorrect Email or Password"
            });
        } else {
            res.json({
                success: false,
                error_message: "Incorrect Email or Password"
            });
        }

    });
}

exports.logout = function(req, res) {
    req.session = null;
    res.clearCookie(config.cookies.rememberme);
    res.redirect('/');
};

// TODO: Send Email
exports.register = function(req, res) {
    user_mysql.user_by_email_count(req.param('email'), function(error, results) {
        if(!error && !results) {
            if(req.param('password') == req.param('password_confirm')) {
                async.series({
                    register: function(callback) {
                        delete req.body._csrf;
                        delete req.body.password_confirm;
                        req.body.password = aes.encrypt(req.param('password'), req.param('email'));
                        req.body.verified = rand.generateKey(10).toLowerCase(),
                        user_mysql.user_insert(req.body, callback);
                    }
                }, function(error, results) {
                    if(!error && results.register) {
                        async.series([
                            function(callback) {
                                req.session.user = { id: results.register.insertId };
                                exports.load_user(req, res, callback);
                            },
                            function(callback) {
                                res.json({
                                    success: true,
                                    next: "/verify/"
                                });

                                email("verify", {
                                    host: req.host,
                                    from: "support@laborate.io",
                                    subject: "Please Verify Your Email",
                                    users: [{
                                        name: req.param('name'),
                                        email: req.param('email'),
                                        code: req.body.verified
                                    }]
                                }, callback);
                            }
                        ]);
                    } else {
                        res.json({
                            success: false,
                            error_message: "User Registration Failed"
                        });
                    }
                });
            } else {
                res.json({
                    success: false,
                    error_message: "Passwords Do Not Match"
                });
            }
        } else {
            res.json({
                success: false,
                error_message: "Email Already Exists"
            });
        }
    });
};

exports.verify = function(req, res) {
    if(req.param('verification_code') == req.session.user.verified) {
        req.session.user.verified = null;
        user_mysql.user_verification(req.session.user.id, null);
        res.json({
            success: true,
            next: "/documents/"
        })
    } else {
        res.json({
            success: false,
            error_message: "Incorrect Verification Code"
        })
    }
};

exports.load_user = function(req, res, next) {
    async.series({
        user: function(callback) {
            user_mysql.user_by_id(req.session.user.id, callback);
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
                verified: user["user_verified"],
                github: (user["user_github"]) ? aes.decrypt(String(user["user_github"]), user["user_email"]) : null,
                code_pricing_id: user["user_code_pricing"],
                code_pricing_documents: user["pricing_documents"],
                code_locations: (user["user_locations"]) ? JSON.parse(aes.decrypt(String(user["user_locations"]), user["user_email"])) : null
            };

            var user_uuid = uuid.v4();
            user_mysql.user_insert_recovery(user["user_id"], user_uuid);
            res.cookie(config.cookies.rememberme, user_uuid, { maxAge: 9000000000, httpOnly: true });
        }
        if(next) next(error);
    });
};
