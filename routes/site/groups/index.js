exports.index = function(req, res, next) {
    req.models.users.find({
        id: req.session.user.id
    }, { autoFetchLimit: 3 }, 1, function(error, users) {
        if(!error && !users.empty) {
            res.renderOutdated('groups/index', {
                title: "Groups",
                header: "users",
                groups: users[0].groups,
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

exports.group = function(req, res, next) {
    var access = !$.map(req.session.user.groups, function(group) {
        return group.pub_id == req.param("group");
    }).empty;

    req.models.users.groups.find({
        pub_id: req.param("group")
    }, {
        autoFetch: access,
        autoFetchLimit: 2
    }, function(error, groups) {
        if(!error && !groups.empty) {
            var group = groups[0];
            var route = (access) ? "group" : "join";

            res.renderOutdated('groups/' + route, {
                title: group.name + res.locals.site_delimeter  + "Groups",
                header: "users",
                group: group,
                js: clientJS.renderTags("groups"),
                css: clientCSS.renderTags("groups"),
                pageTrack: true,
                background: req.backdrop("blurry")
            });
        } else {
            res.error(404, null, error);
        }
    });
}
