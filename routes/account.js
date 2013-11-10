var orm = require("orm");

exports.index = function(req, res) {
    req.models.users.pricing.find({
        student: req.session.user.pricing.student
    }, [ "priority", "A" ], function(error, plans) {
        res.renderOutdated('account/index', {
            title: 'Account',
            navigation: 'User Settings',
            mode: "account",
            user: req.session.user,
            plans: plans,
            github_auth_url: req.github.auth_url,
            js: clientJS.renderTags("account", "header"),
            css: clientCSS.renderTags("account", "header"),
        });
    });
};

exports.profile = function(req, res) {
    req.models.users.exists({
        id: orm.ne(req.session.user.id),
        screen_name: req.param('screen_name')
    }, function(error, exists) {
        if(!error) {
            if(exists) {
                res.error(200, "Screen Name Already Exists");
            } else if(req.param('screen_name').length > 30) {
                res.error(200, "Screen Name Is To Long");
            } else if(!req.param("name")) {
                res.error(200, "Name Is Required");
            } else if(!req.param("email")) {
                res.error(200, "Email Is Required");
            } else {
                req.models.users.get(req.session.user.id, function(error, user) {
                    if(!error && user) {
                        user.save({
                            name: req.param("name"),
                            screen_name: req.param("screen_name"),
                            email: req.param("email")
                        }, function(error) {
                            if(error) {
                                res.error(200, "Failed To Update Profile", error);
                            } else {
                                req.session.user = user;
                                req.session.save();
                                res.json({ success: true });
                            }
                        });
                    } else {
                        res.error(200, "Failed To Update Profile", error);
                    }
                });
            }
        } else {
            res.error(200, "Failed To Update Profile");
        }
    });
}

exports.change_password = function(req, res) {
    req.models.users.get(req.session.user.id, function(error, user) {
        if(!error) {
            if(req.models.users.hash($.trim(req.param('old_password'))) == user.password) {
                if($.trim(req.param('new_password')) != $.trim(req.param('confirm_password'))) {
                        res.error(200, "Passwords Don't Match");
                } else if($.trim(req.param('new_password')).length <= 6) {
                        res.error(200, "Password Is To Short");
                } else {
                    user.save({
                        password: req.models.users.hash($.trim(req.param('new_password')))
                    }, function(error) {
                        if(!error) {
                            req.session.user = user;
                            req.session.save();
                            res.json({ success: true });
                        } else {
                            res.error(200, "Failed To Change Password", error);
                        }
                    });
                }
            } else {
                res.error(200, "Old Password Incorrect");
            }
        } else {
            res.error(200, "Failed To Change Password", error);
        }
    });
}

exports.delete_account = function(req, res) {
    req.models.users.get(req.session.user.id, function(error, user) {
        if(!error) {
            if(req.models.users.hash($.trim(req.param('password'))) == user.password) {
                req.stripe.customers.del(req.session.user.stripe, function(error, customer) {
                    if(!error && customer) {
                        user.remove(function(error) {
                            if(!error) {
                                res.json({
                                    success: true,
                                    callback: "window.location.href = '/logout/';"
                                });
                            } else {
                                res.error(200, "Failed To Delete Account", error);
                            }
                        });
                    } else {
                        res.error(200, "Failed To Delete Account", error);
                    }
                });
            } else {
                res.error(200, "Password Incorrect");
            }
        } else {
            res.error(200, "Failed To Delete Account", error);
        }
    });
}

exports.remove_location = function(req, res) {
    if(req.session.user.locations && (req.param("location") in req.session.user.locations)) {
        req.models.users.get(req.session.user.id, function(error, user) {
            if(!error) {
                delete req.session.user.locations[req.param("location")];
                user.save({ locations: req.session.user.locations });
                res.json({success: true});
                req.session.save();
            } else {
                res.error(200, "Failed To Remove Location", true, error);
            }
        });
    } else {
        res.error(200, "Failed To Remove Location");
    }
};

exports.add_card = function(req, res) {
    req.models.users.get(req.session.user.id, function(error, user) {
        if(!error) {
            req.stripe.customers.createCard(req.session.user.stripe, {
                card: {
                    name: req.param("name"),
                    number: req.param("card"),
                    exp_month: req.param("expiration").month,
                    exp_year: req.param("expiration").year,
                    cvc: req.param("cvc")
                }
            }, function(error, card) {
                if(!error) {
                    req.session.user.card = {
                        stripe: card.id,
                        name: req.param("name"),
                        card: req.param("card").substr(req.param("card").length - 4),
                        type: card.type.toLowerCase()
                    };

                    user.save({ card: req.session.user.card }, function(error) {
                        if(!error) {
                            res.json({
                                success: true,
                                callback: "window.location.reload();"
                            });
                            req.session.save();
                        } else {
                            res.error(200, "Failed To Add Credit Card", error);
                        }
                    });
                } else {
                    res.error(200, error.message, error);
                }
            });
        } else {
            res.error(200, "Failed To Add Credit Card", error);
        }
    });
}

exports.remove_card = function(req, res) {
    req.models.users.get(req.session.user.id, function(error, user) {
        if(!error) {
            req.stripe.customers.deleteCard(
                req.session.user.stripe,
                req.session.user.card.stripe,
            function(error) {
                if(!error) {
                    req.session.user.card = {};

                    user.save({ card: req.session.user.card }, function(error) {
                        if(!error) {
                            res.json({ success: true });
                            req.session.save();

                        } else {
                            res.error(200, "Failed To Remove Credit Card", error);
                        }
                    });
                } else {
                    res.error(200, error.message, error);
                }
            });
        } else {
            res.error(200, "Failed To Remove Credit Card", error);
        }
    });
}
