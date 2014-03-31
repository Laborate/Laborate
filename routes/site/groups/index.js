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
    async.parallel({
        access: function(callback) {
            callback(null, !$.map(req.session.user.groups, function(group) {
                if(group.pub_id == req.param("group")) {
                    return true;
                }
            }).empty);
        },
        group: function(callback) {
            req.models.users.groups.one({
                pub_id: req.param("group")
            }, function(error, group) {
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
                    }
                }, function(error, data) {
                    group.posts = data.posts;
                    group.documents = data.documents;
                    callback(error, group);
                });
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
            } else {
                res.redirect("/groups/");
            }
        } else {
            res.error(404, null, error);
        }
    });
}
