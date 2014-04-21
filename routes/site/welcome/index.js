var pages = ["index", "creative", "social", "explore"];

exports.index = function(req, res) {
    req.models.users.get(req.session.user.id, function(error, user) {
        if(!error) {
            user.has_gravatar(function(enabled) {
                res.renderOutdated('welcome/index', {
                    title: 'Welcome',
                    user: req.session.user,
                    gravatar_enabled: enabled,
                    js: clientJS.renderTags("backdrop", "welcome"),
                    css: clientCSS.renderTags("backdrop", "welcome"),
                    backdrop: req.backdrop(),
                    pageTrack: true
                });
            });
        } else {
            res.error(404, null, error);
        }
    });
};


exports.creative = function(req, res) {
    res.renderOutdated('welcome/creative', {
        title: 'Welcome',
        user: req.session.user,
        js: clientJS.renderTags("backdrop", "welcome", "codemirror"),
        css: clientCSS.renderTags("backdrop", "welcome", "codemirror"),
        backdrop: req.backdrop(),
        pageTrack: true
    });
};

exports.social = function(req, res) {
    var users = [];
    var screen_names = [];
    var counter = 0;

    req.models.users.count(function(error, count) {
        async.until(
            function() {
                return (counter > 9) || (counter > count);
            },
            function(next) {
                req.models.users.find({
                    id: req.db.tools.ne((req.session.user) ? req.session.user.id : null)
                })
                .only(["id", "name", "screen_name", "email"])
                .skip(Math.floor(Math.random() * count))
                .limit(1)
                .run(function(error, user) {
                    if(!user.empty && screen_names.indexOf(user[0].screen_name) == -1) {
                        counter++;
                        users.push(user[0]);
                        screen_names.push(user[0].screen_name);
                    }

                    next(error);
                });
            },
            function(errors) {
                if(!errors) {
                    async.mapSeries(users, function(user, callback) {
                        req.models.documents.roles.find({
                            user_id: user.id
                        }, ["viewed"], 60, ["created", "Z"], function(error, roles) {
                            user.documents = $.map(roles, function(role) {
                                return role.viewed;
                            });
                            callback(error, user);
                        });
                    }, function(error, laborators) {
                        if(!error) {
                            res.renderOutdated('welcome/social', {
                                title: 'Welcome',
                                users: laborators.sort(function(a, b) {
                                    if(a.documents.length === b.documents.length) {
                                        var c = (a.documents.empty) ? 0 : Math.max.apply(null, a.documents);
                                        var d = (b.documents.empty) ? 0 : Math.max.apply(null, b.documents);
                                    } else {
                                        var c = a.documents.length;
                                        var d = b.documents.length;
                                    }

                                    return (c > d) ? -1 : ((c < d) ? 1 : 0);
                                }),
                                js: clientJS.renderTags("backdrop", "welcome"),
                                css: clientCSS.renderTags("backdrop", "welcome"),
                                backdrop: req.backdrop(),
                                pageTrack: true
                            });
                        } else {
                            res.error(404, null, error);
                        }
                    });
                } else {
                    res.error(404, null, errors);
                }
            }
        )
    });
};

exports.laborator = function(req, res) {
    req.models.documents.all({
        private: false
    }, {
        autoFetch:true,
        autoFetchLimit: 3
    }, 10, ["viewed", "Z"], function (error, documents) {
        if(!error) {
            res.renderOutdated('welcome/laborator', {
                title: 'Welcome',
                user: req.session.user,
                documents: documents,
                js: clientJS.renderTags("welcome", "explore", "backdrop"),
                css: clientCSS.renderTags("welcome", "backdrop"),
                backdrop: req.backdrop(),
                pageTrack: true
            });
        } else {
            res.error(404, null, error);
        }
    });
};
