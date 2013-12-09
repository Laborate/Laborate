/* Checks */
exports.restrictAccess = function(req, res, next) {
    if(req.session.user) {
        if(config.cookies.rememberme in req.cookies) {
            if(req.session.user.verify && !(/^\/verify/.exec(req.url))) {
                    res.redirect("/verify/");
            } else {
                if(req.session.user.deliquent && !(/^\/account/.exec(req.url))) {
                    res.redirect("/account/billing/");
                } else {
                    if(next) next();
                }
            }
        } else {
            req.models.users.get(req.session.user.id, function(error, user) {
                if(!error && user) {
                    user.set_recovery(req, res);
                    if(req.session.user.verify && !(/^\/verify/.exec(req.url))) {
                            res.redirect("/verify/");
                    } else {
                        if(req.session.user.deliquent && !(/^\/account/.exec(req.url))) {
                            res.redirect("/account/billing/");
                        } else {
                            if(next) next();
                        }
                    }
                } else {
                    res.error(401, false, error);
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
                        res.error(401, false, error);
                    }
            });
        } else {
            res.error(401);
        }
    }
};

exports.loginCheck = function(req, res, next) {
    if(req.session.user) {
        res.redirect('/documents');
    } else {
        if(config.cookies.rememberme in req.cookies) {
            req.models.users.find({recovery: req.cookies[config.cookies.rememberme]},
                function(error, user) {
                    if(!error && user.length == 1) {
                        user[0].set_recovery(req, res);
                        req.session.user = user[0];
                        res.redirect('/documents');
                    } else {
                        if(next) next();
                    }
            });
        } else {
            if(next) next();
        }
    }
};

exports.loginDenied = function(req, res, next) {
    if(req.session.user) {
        res.error(404);
    } else {
        next();
    }
}

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
            var user = users[0];

            if(req.session.organization.id) {
                if(user.organizations.length != 0) {
                    $.each(user.organizations, function(key, role) {
                        if(req.session.organization.id == role.organization_id) {
                            finish(user);
                            return false;
                        } else {
                            res.error(200, "Invalid Credentials", error);
                            return true;
                        }
                    });
                } else {
                    res.error(200, "Invalid Credentials", error);
                }
            } else {
                finish(user);
            }
        } else {
            res.error(200, "Invalid Credentials", error);
        }
    });

    function finish(user) {
        if(user.admin && $.isEmptyObject(user.stripe)) {
            user.set_recovery(req, res);
            user.verified(req, function(user) {
                req.session.user = user;
                res.json({
                    success: true,
                    next: req.session.redirect_url || "/documents/"
                 });
                 delete req.session.reset;
                 delete req.session.redirect_url;
                 req.session.save();
            });
        } else {
            req.session.user = user;
            res.json({
                success: true,
                next: req.session.redirect_url || "/documents/"
            });
            delete req.session.redirect_url;
            req.session.save();
        }
    }
}

exports.logout = function(req, res) {
    delete req.session.user;
    delete req.session.last_page;
    delete req.session.reset;
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
            res.error(200, "Email Already Exists", error);
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
                            screen_name: $.trim(req.param('screen_name')).toLowerCase(),
                            email: $.trim(req.param('email')),
                            password: $.trim(req.param('password')),
                            pricing_id: 1
                        }, function(error, user) {
                            if(!error) {
                                if(req.session.organization.id) {
                                    user.add_organization(req.session.organization.id);
                                }

                                user.set_recovery(req, res);
                                req.session.user = user;
                                req.session.save();
                                res.json({
                                    success: true,
                                    next: "/verify/"
                                });

                                req.email("verify", {
                                    from: config.email.auth.user,
                                    subject: "Please Verify Your Email",
                                    users: [{
                                        name: user.name,
                                        email: user.email,
                                        code: user.verify
                                    }]
                                }, blank_function);
                            } else {
                                res.error(200, "Invalid Email Address", error);
                            }
                        });
                    }
                } else {
                    res.error(200, "Failed To Register", error);
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
                res.redirect(req.session.redirect_url || "/documents/");
                delete req.session.redirect_url;
                req.session.save();
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
                res.redirect(req.session.last_page || '/documents');
                delete req.session.reset;
                delete req.session.last_page;
                req.session.save();
            } else {
                res.redirect('/logout/');
            }
        });
    } else {
        res.redirect('/logout/');
    }
}

exports.reset = function(req, res, next) {
    req.models.users.find({
        email: req.param("email")
    }, function(error, users) {
        if(!error && users.length == 1) {
            var user = users[0];
            user.set_reset();

            req.session.reset = true;
            req.session.save();

            res.json({
                success: true,
                next: "/reset"
            });

            req.email("reset", {
                from: "support@laborate.io",
                subject: "Reset Password Link",
                users: [{
                    name: user.name,
                    email: user.email,
                    code: user.reset
                }]
            });
        } else {
            res.error(200, "Email Address Not Found", error);
        }
    });

}

exports.reset_password = function(req, res, next) {
    req.models.users.find({
        reset: req.param("code")
    }, function(error, users) {
        if(!error && users.length == 1) {
            if($.trim(req.param("password")) != $.trim(req.param("password_confirm"))) {
                res.error(200, "Passwords Do Not Match");
            } else if($.trim(req.param('password')).length <= 6) {
                res.error(200, "Password Is To Short");
            } else {
                var user = users[0];

                user.save({
                    reset: null,
                    password: user.hash($.trim(req.param('password')))
                }, function(error, user) {
                    if(!error) {
                        req.session.user = user;
                        delete req.session.reset;
                        req.session.save();

                        res.json({
                            success: true,
                            next: "/"
                        });
                    } else {
                        res.error(200, "Failed To Reset Password", error);
                    }
                });
            }
        } else {
            res.error(200, "Failed To Reset Password", error);
        }
    });
}
