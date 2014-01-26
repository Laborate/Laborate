var async = require("async");
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

exports.gravatar = function(req, res) {
    res.renderOutdated('welcome/gravatar', {
        title: 'Welcome',
        user: req.session.user,
        js: clientJS.renderTags("backdrop", "welcome"),
        css: clientCSS.renderTags("backdrop", "welcome"),
        backdrop: req.backdrop(),
        pageTrack: true
    });
};

exports.social = function(req, res) {
    req.models.users.all({
        id: req.db.tools.ne(req.session.user.id)
    }).limit(10).orderRaw("rand()").run(function(error, users) {
        if(!error) {
            async.mapSeries(users, function(user, callback) {
                req.models.documents.roles.find({
                    user_id: user.id
                }, ["viewed"], 60, ["created", "Z"], function(error, roles) {
                    user.documents = $.map(roles, function(role) {
                        return role.viewed;
                    });
                    callback(null, user);
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
            res.error(404, null, error);
        }
    });
};

exports.laborator = function(req, res) {
    req.models.documents.all({}, {
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
