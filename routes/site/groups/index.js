exports.index = function(req, res, next) {
    req.models.users.one({
        id: req.session.user.id
    }, { autoFetchLimit: 3 }, function(error, user) {
        if(!error && user) {
            res.renderOutdated('groups/index', {
                title: "Groups",
                header: "users",
                groups: user.groups.sort(function(a, b) {
                    return a.private < b.private;
                }),
                js: clientJS.renderTags("groups"),
                css: clientCSS.renderTags("groups"),
                pageTrack: true,
                background: req.backdrop
            });
        } else {
            res.error(404, null, error);
        }
    });
}

exports.create = function(req, res, next) {
    res.renderOutdated('groups/create', {
        title: "Create a Group",
        header: "users",
        js: clientJS.renderTags("groups"),
        css: clientCSS.renderTags("groups"),
        pageTrack: true
    });
}

exports.group = function(req, res, next) {
    var me = req.session.user || req.fake.user;

    async.parallel({
        access: function(callback) {
            if(!me.fake) {
                callback(null, !$.map(me.groups, function(group) {
                    if(group.pub_id == req.param("group")) {
                        return true;
                    }
                }).empty);
            } else {
                callback(null, false);
            }
        },
        group: function(callback) {
            req.models.users.groups.one({
                pub_id: req.param("group")
            }, function(error, group) {
                if(!error && group) {
                    async.parallel({
                        posts: function(callback) {
                            req.models.posts.count({
                                group_id: group.id
                            }, callback);
                        },
                        documents: function(callback) {
                            req.models.documents.roles.count({
                                viewed: req.db.tools.gte(10)
                            }, callback);
                        },
                        users: function(callback) {
                            async.mapSeries(group.exclude(me.id), function(user, next) {
                                user.activity = [];
                                    async.parallel([
                                        function(move) {
                                            req.models.posts.count({
                                                owner_id: user.id,
                                            }, function(error, posts) {
                                                for(var i = 0; i < posts; i++) {
                                                    user.activity.push(Math.floor(Math.random() * (10)));
                                                }

                                                move(error);
                                            });
                                        },
                                        function(move) {
                                            req.models.documents.roles.count({
                                                user_id: user.id,
                                            }, function(error, roles) {
                                                for(var i = 0; i < roles; i++) {
                                                    user.activity.push(Math.floor(Math.random() * (15)));
                                                }

                                                move(error);
                                            });
                                        }
                                ], function(error) {
                                    next(error, user);
                                });
                            }, callback);
                        }
                    }, function(error, data) {
                        group.posts = data.posts;
                        group.documents = data.documents;
                        group.users = data.users.sort(function(a, b) {
                            if(a.activity.length === b.activity.length) {
                                var c = (a.activity.empty) ? 0 : Math.max.apply(null, a.activity);
                                var d = (b.activity.empty) ? 0 : Math.max.apply(null, b.activity);
                            } else {
                                var c = a.activity.length;
                                var d = b.activity.length;
                            }

                            return (c > d) ? -1 : ((c < d) ? 1 : 0);
                        });
                        callback(error, group);
                    });
                } else {
                    callback(error);
                }
            });
        }
    }, function(errors, data) {
        var group = data.group;
        var access = data.access;

        if(!errors) {
            if(group && (access || !group.private)) {
                res.renderOutdated('groups/profile', {
                    title: group.name,
                    header: "users",
                    group: group,
                    access: access,
                    js: clientJS.renderTags("groups"),
                    css: clientCSS.renderTags("groups"),
                    pageTrack: true,
                    background: req.backdrop("blurry")
                });
            } else if(req.robot) {
                res.error(404);
            } else {
                res.redirect("/groups/");
            }
        } else {
            res.error(404, null, error);
        }
    });
}
