exports.index = function(req, res, next) {
    req.models.users.find({
        id: req.session.user.id
    }, { autoFetchLimit: 3 }, 1, function(error, users) {
        if(!error && !users.empty) {
            res.renderOutdated('groups/index', {
                title: "Groups",
                header: "users",
                groups: users[0].groups.sort(function(a, b) {
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
        title: "Create Group",
        header: "users",
        js: clientJS.renderTags("groups"),
        css: clientCSS.renderTags("groups"),
        pageTrack: true
    });
}

exports.group = function(req, res, next) {
    var access = !$.map(req.session.user.groups, function(group) {
        if(group.pub_id == req.param("group")) {
            return true;
        }
    }).empty;

    req.models.users.groups.find({
        pub_id: req.param("group")
    }, {
        autoFetch: access,
        autoFetchLimit: 2
    }, function(error, groups) {
        if(!error) {
            var group = groups[0];
            var route = (access) ? "group" : "request";

            if(!groups.empty && (access || !group.private)) {
                res.renderOutdated('groups/' + route, {
                    title: group.name,
                    header: "users",
                    group: group,
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
