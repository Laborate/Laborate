/* Checks */
exports.restrictAccess = function(req, res, next) {
    if(req.session.user) {
        if(config.cookies.rememberme in req.cookies) {
            if(req.session.user.verify && req.url.indexOf("verify") == -1) {
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
                    res.error(401, false, true, error);
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
                        req.session.save();
                        res.redirect(req.originalUrl);
                    } else {
                        res.error(401, false, true, error);
                    }
            });
        } else {
            res.error(401);
        }
    }
};

exports.loginCheck = function(req, res, next) {
    if(req.session.user) {
        res.redirect(req.session.last_page || '/documents');
    } else {
        if(config.cookies.rememberme in req.cookies) {
            req.models.users.find({recovery: req.cookies[config.cookies.rememberme]},
                function(error, user) {
                    if(!error && user.length == 1) {
                        user[0].set_recovery(req, res);
                        req.session.user = user[0];
                        res.redirect(req.session.last_page || '/documents');
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

/* Operations */
exports.login = function(req, res, next) {
    req.models.users.find({
        email: $.trim(req.param('email')),
        password: req.models.users.hash($.trim(req.param('password')))
    }, function(error, users) {
        if(!error && users.length == 1) {
            if(users[0].admin && $.isEmptyObject(users[0].stripe)) {
                users[0].verified(req, function(user) {
                    req.session.user = user;
                    req.session.save();

                    res.json({
                        success: true,
                        next: "/reload/"
                     });
                });
            } else {
                req.session.user = users[0];
                req.session.save();

                res.json({
                    success: true,
                    next: "/reload/"
                 });
            }
        } else {
            res.error(200, "Invalid Credentials", true, error);
        }
    });
}

exports.logout = function(req, res) {
    delete req.session.user;
    req.session.save();
    res.clearCookie(config.cookies.rememberme, {
        domain: "." + req.host
    });
    res.redirect('/');
};

exports.register = function(req, res, next) {
    req.models.users.exists({
        email: req.param('email')
    }, function(error, exists) {
        if(error || exists) {
            res.error(200, "Email Already Exists");
        } else {
            req.models.users.exists({
                screen_name: req.param('screen_name')
            }, function(error, exists) {
                if(!error) {
                    if(exists) {
                        res.error(200, "Screen Name Already Exists");
                    } else if(req.param('screen_name').length > 30) {
                        res.error(200, "Screen Name Is To Long");
                    } else if(req.param('password').length <= 6) {
                        res.error(200, "Password Is To Short");
                    } else if(req.param('password') != req.param('password_confirm')) {
                        res.error(200, "Passwords Do Not Match");
                    } else {
                        req.models.users.create({
                            name: $.trim(req.param('name')),
                            screen_name: $.trim(req.param('screen_name')),
                            email: $.trim(req.param('email')),
                            password: $.trim(req.param('password')),
                            pricing_id: 1
                        }, function(error, user) {
                            if(!error) {
                                req.session.user = user;
                                req.session.save();
                                res.json({
                                    success: true,
                                    next: "/reload/"
                                });

                                req.email("verify", {
                                    from: "support@laborate.io",
                                    subject: "Please Verify Your Email",
                                    users: [{
                                        name: user.name,
                                        email: user.email,
                                        code: user.verify
                                    }]
                                });
                            } else {
                                res.error(200, "Invalid Email Address", true, error);
                            }
                        });
                    }
                } else {
                    res.error(200, "Failed To Register", true, error);
                }
            });
        }
    });
};

exports.verify = function(req, res, next) {
    if(!req.session.user.verify) {
        res.redirect("/documents/");
    } else if($.trim(req.param('code')) != req.session.user.verify) {
        res.error(401);
    } else {
        req.models.users.get(req.session.user.id, function(error, user) {
            user.verified(req, function(user) {
                req.session.user = user;
                req.session.save();
                res.redirect("/reload/");
            });
        });
    }
};

exports.reload = function(req, res, next) {
    if(req.session.user) {
        req.models.users.get(req.session.user.id, function(error, user) {
            if(!error && user) {
                user.set_recovery(req, res);
                req.session.user = user;
                res.redirect(req.session.redirect_url || req.session.last_page || '/documents');
                delete req.session.redirect_url;
                req.session.save();
            } else {
                res.redirect('/logout/');
            }
        });
    } else {
        res.redirect('/logout/');
    }
}
