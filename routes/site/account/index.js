exports.index = function(req, res, next) {
    var user = req.session.user;

    if(user.deliquent) {
        exports.remove_card(req, res, false);
    }

    async.parallel({
        plans: function(callback) {
            req.models.pricing.find({
                student: user.pricing.student,
                organization: false
            }, [ "priority", "A" ], callback);
        },
        notifications: function(callback) {
            req.models.notifications.find({
                user_id: user.id
            }, callback);
        },
        payments: function(callback) {
            req.models.payments.find({
                user_id: user.id
            }, callback);
        },
        posts: function(callback) {
            req.models.posts.count({
                owner_id: user.id,
                parent_id: null
            }, callback);
        },
        replies: function(callback) {
            req.models.posts.count({
                owner_id: user.id,
                parent_id: req.db.tools.ne(null)
            }, callback);
        }
    }, function(errors, data) {
        req.error.capture(errors);

        user.posts = data.posts;
        user.replies = data.replies;
        user.payments = data.payments;
        user.notifications = data.notifications;

        res.renderOutdated('account/index', {
            title: 'Account',
            plans: data.plans,
            user: user,
            js: clientJS.renderTags("account"),
            css: clientCSS.renderTags("account"),
        });
    });
};

exports.profile = function(req, res) {
    req.models.users.exists({
        id: req.db.tools.ne(req.session.user.id),
        email: req.param('email')
    }, function(error, exists) {
        if(error || exists) {
            res.error(200, "Email Already Exists", error);
        } else {
            req.models.users.exists({
                id: req.db.tools.ne(req.session.user.id),
                screen_name: req.param('screen_name')
            }, function(error, exists) {
                if(!error) {
                    if(exists) {
                        res.error(200, "Screen Name Already Exists");
                    } else if(req.param('screen_name').length <= 2) {
                        res.error(200, "Screen Name Is To Short");
                    } else if(req.param('screen_name').length > 30) {
                        res.error(200, "Screen Name Is To Long");
                    } else if(req.param('screen_name').indexOf(" ") != -1) {
                        res.error(200, "Screen Name Has Spaces");
                    } else {
                        req.stripe.customers.update(req.session.user.stripe, {
                            email: req.param("email")
                        }, function(error) {
                            if(!error) {
                                req.models.users.one({
                                    id: req.session.user.id
                                }, { autoFetch: false }, function(error, user) {
                                    if(!error && user) {
                                        var profile = {
                                            name: req.param("name"),
                                            screen_name: req.param("screen_name"),
                                            url: req.param("url"),
                                            location: req.param("location"),
                                        }

                                        user.save(profile, function(error, user) {
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
                            } else {
                                res.error(200, "Failed To Update Profile", error);
                            }
                        });
                    }
                } else {
                    res.error(200, "Failed To Update Profile", error);
                }
            });
        }
    });
}

exports.change_password = function(req, res) {
    req.models.users.one({
        id: req.session.user.id
    }, { autoFetch: false }, function(error, user) {
        if(!error) {
            if(req.models.users.hash($.trim(req.param('old_password'))) == user.password) {
                if($.trim(req.param('new_password')) != $.trim(req.param('confirm_password'))) {
                        res.error(200, "Passwords Don't Match");
                } else if($.trim(req.param('new_password')).length <= 6) {
                        res.error(200, "Password Is To Short");
                } else {
                    user.save({
                        password: user.hash($.trim(req.param('new_password')))
                    }, function(error) {
                        if(!error) {
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
                req.stripe.customers.del(req.session.user.stripe, req.error.capture);

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
                res.error(200, "Password Incorrect");
            }
        } else {
            res.error(200, "Failed To Delete Account", error);
        }
    });
}

exports.remove_location = function(req, res) {
    if(req.session.user.locations && (req.param("location") in req.session.user.locations)) {
        req.models.users.one({
            id: req.session.user.id
        }, { autoFetch: false }, function(error, user) {
            if(!error) {
                delete user.locations[req.param("location")];

                // JSON.cycle is a patch til I figure out why the orm
                // was not saving the changed locations object
                user.save({ locations: JSON.cycle(user.locations) }, function(error, user) {
                    if(!error) {
                        req.session.user = user;
                        req.session.save();
                        res.json({ success: true });
                    } else {
                        res.error(200, "Failed To Remove Location", error);
                    }
                });
            } else {
                res.error(200, "Failed To Remove Location", error);
            }
        });
    } else {
        res.error(200, "Failed To Remove Location");
    }
};

exports.add_card = function(req, res) {
    req.models.users.one({
        id: req.session.user.id
    }, { autoFetch: false }, function(error, user) {
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
                    var number = req.param("card").replace(/ /g, "");
                    user.save({
                        deliquent: false,
                        card: {
                            id: card.id,
                            name: req.param("name"),
                            card: number.substr(number.length - 4),
                            type: card.type.toLowerCase()
                        }
                    }, function(error) {
                        if(!error) {
                            res.json({
                                success: true,
                                callback: "window.location.reload();"
                            });
                        } else {
                            res.error(200, "Failed To Add Credit Card", error);
                        }
                    });
                } else {
                    res.error(200, error.message.split(".")[0], error);
                }
            });
        } else {
            res.error(200, "Failed To Add Credit Card", error);
        }
    });
}

exports.remove_card = function(req, res, next) {
    if(!$.isEmptyObject(req.session.user.card)) {
        req.models.users.one({
            id: req.session.user.id
        }, { autoFetch: false }, function(error, user) {
            if(!error) {
                req.stripe.customers.deleteCard(
                    req.session.user.stripe,
                    req.session.user.card.id,
                function(error) {
                    if(!error) {
                        user.save({ card: {} }, function(error) {
                            if(!error) {
                                if(next) res.json({ success: true });

                                if(!req.session.user.deliquent && req.session.user.pricing.amount != 0) {
                                    req.models.notifications.create({
                                        message: "Please enter a credit card, your plan requires a card on file",
                                        priority: true,
                                        user_id: user.id
                                    }, req.error.capture);
                                }
                            } else {
                                if(next) res.error(200, "Failed To Remove Credit Card", error);
                            }
                        });
                    } else {
                        if(next) res.error(200, "Failed To Remove Credit Card", error);
                    }
                });
            } else {
                if(next) res.error(200, "Failed To Remove Credit Card", error);
            }
        });
    } else {
        if(next) res.error(200, "Failed To Remove Credit Card", error);
    }
}

exports.plan_change = function(req, res) {
    req.models.users.get(req.session.user.id, function(error, user) {
        if(!error) {
            req.stripe.customers.updateSubscription(user.stripe, {
                plan: req.param("plan"),
                prorate: true,
                trial_end: req.core.days.next_month()
            }, function(error) {
                if(!error) {
                    req.models.pricing.one({
                        plan: req.param("plan")
                    }, function(error, plan) {
                        if(!error && plan) {
                            user.setPricing(plan, function(error, user) {
                                if(!error) {
                                    user.save({
                                        trial: false,
                                        deliquent: (plan.amount == 0) ? false : user.deliquent
                                    }, function(error, user) {
                                        if(!error) {
                                            req.session.user = user;
                                            req.session.save();
                                            res.json({ success: true });
                                        } else {
                                            res.error(200, "Failed To Change Plan", error);
                                        }
                                    });
                                } else {
                                    res.error(200, "Failed To Change Plan", error);
                                }
                            });
                        } else {
                            res.error(200, "Failed To Change Plan", error);
                        }
                    });
                } else {
                    res.error(200, "Failed To Change Plan", error);
                }
            });
        } else {
            res.error(200, "Failed To Change Plan", error);
        }
    });
}

exports.notification_hide = function(req, res) {
    req.models.notifications.get(req.param("notification"), function(error, notification) {
        if(!error && notification) {
            notification.save({
                priority: false
            }, function(error) {
                if(!error) {
                    res.json({ success: true });
                } else {
                    res.error(200, "Failed To Hide Notification", error);
                }
            });
        } else {
            res.error(200, "Failed To Hide Notification", error);
        }
    });
}

exports.notification_remove = function(req, res) {
    req.models.notifications.get(req.param("notification"), function(error, notification) {
        if(!error && notification) {
            notification.remove(function(error) {
                if(!error) {
                    res.json({ success: true });
                } else {
                    res.error(200, "Failed To Remove Notification", error);
                }
            });
        } else {
            res.error(200, "Failed To Hide Notification", error);
        }
    });
}
