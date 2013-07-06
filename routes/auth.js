/* Modules: NPM */
var $ = require('jquery');
var crypto = require('crypto');
var async = require("async");
var uuid = require('node-uuid');
var rand = require("generate-key");

/* Modules: Custom */
var core = require('./core');
var error_lib = require('./error');
var aes = require('../lib/core/aes');
var email = require('../lib/email');

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
            req.models.users.get(req.session.user.id, function(error, user) {
                if(!error && user) {
                    user.set_recovery(req, res);
                    if(next) next();
                } else {
                    error_lib.handler({status: 401}, req, res, next);
                }
            });
        }
    } else {
        if(config.cookies.rememberme in req.cookies) {
            req.models.users.find({recovery: req.cookies[config.cookies.rememberme]},
                function(error, user) {
                    if(!error && user.length == 1) {
                        user[0].set_recovery(req, res);
                        req.session.user = user[0];
                        if(next) next();
                    } else {
                        error_lib.handler({status: 401}, req, res, next);
                    }
            });
        } else {
            error_lib.handler({status: 401}, req, res, next);
        }
    }
};

exports.loginCheck = function(req, res, next) {
    if(req.session.user) {
        res.redirect('/documents/');
    } else {
        if(config.cookies.rememberme in req.cookies) {
            req.models.users.find({recovery: req.cookies[config.cookies.rememberme]},
                function(error, user) {
                    if(!error && user.length == 1) {
                        user[0].set_recovery(req, res);
                        req.session.user = user[0];
                        res.redirect('/documents/');
                    } else {
                        if(next) next();
                    }
            });
        } else {
            if(next) next();
        }
    }
};

exports.xhr = function(req, res, next) {
    if(req.xhr) {
        next();
    } else {
        res.redirect("/documents/");
    }
}

/* Module Exports: Access Operations */
exports.login = function(req, res, next) {
    req.models.users.find({
        email: $.trim(req.param('email')),
        password: req.models.users.hash($.trim(req.param('password')))
    }, function(error, users) {
        if(!error && users.length == 1) {
            users[0].set_recovery(req, res);
            req.session.user = users[0];
            res.json({
                success: true,
                next: "/documents/"
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
    res.clearCookie(config.cookies.rememberme, { domain: req.host.replace(/^[^.]+\./g, "") });
    res.redirect('/');
};

exports.register = function(req, res) {
    req.models.users.exists({email: req.param('email')}, function(error, exists) {
        if(!error && !exists) {
            if(req.param('password') == req.param('password_confirm')) {
                req.models.users.create({
                    name: $.trim(req.param('name')),
                    screen_name: $.trim(req.param('screen_name')),
                    email: $.trim(req.param('email')),
                    password: $.trim(req.param('password'))
                }, function(error, user) {
                    if(!error) {
                        user.set_recovery(req, res);
                        req.session.user = user;
                        res.json({
                            success: true,
                            next: "/verify/"
                        });

                        email("verify", {
                            host: req.host,
                            from: "support@laborate.io",
                            subject: "Please Verify Your Email",
                            users: [{
                                name: user.name,
                                email: user.email,
                                code: user.verified
                            }]
                        });
                    } else {
                        failed("Please Enter A Valid Email");
                    }
                });
            } else {
                failed("Passwords Do Not Match");
            }
        } else {
            failed("Email Already Exists")
        }
    });

    function failed(message) {
        res.json({
            success: false,
            error_message: message
        });
    }
};

exports.verify = function(req, res) {
    if($.trim(req.param('verification_code')) == req.session.user.verified) {
        req.models.users.get(req.session.user.id, function(error, user) {
            user.verified = null;
            req.session.user = user;
            res.json({
                success: true,
                next: "/documents/"
            });
        });
    } else {
        res.json({
            success: false,
            error_message: "Incorrect Verification Code"
        })
    }
};
