exports.create = function(req, res, next) {
    if(req.param("name")) {
        req.models.users.groups.create({
            name: req.param("name"),
            description: req.param("description"),
            private: (req.param("private") === "true"),
            owner_id: req.session.user.id
        }, function(error, group) {
            if(!error && group) {
                res.json({
                    success: true,
                    group: group.pub_id
                });
            } else {
                res.error(200, "Failed To Create Group", error);
            }
        });
    } else {
        res.error(200, "Missing Information");
    }
}

exports.remove = function(req, res, next) {
    req.models.users.groups.one({
        pub_id: req.param("group"),
        owner_id: req.session.user.id
    }, function(error, group) {
        if(!error && group) {
            group.remove();
            res.redirect("/groups/");
        } else {
            res.error(404, null, error);
        }
    });
}

exports.leave = function(req, res, next) {
    req.models.users.get(req.session.user.id, function(error, user) {
        if(!error && user) {
            async.each(user.groups, function(group, next) {
                if(group.owner_id != user.id && group.pub_id == req.param("group")) {
                    group.removeUsers(user, next);
                } else {
                    next();
                }
            }, function(errors) {
                if(!errors) {
                    res.redirect("/groups/");
                } else {
                    res.error(404, null, errors);
                }
            });
        } else {
            res.error(401, null, error);
        }
    });
}

exports.private = function(req, res, next) {
    req.models.users.groups.one({
        pub_id: req.param("group")
    }, { autoFetch: false },  function(error, group) {
        if(!error && group && req.session.user.id == group.owner_id) {
            group.save({
                private: !group.private
            });

            res.redirect("/groups/" + group.pub_id + "/");
        } else {
            res.error(404, null, error);
        }
    });
}
