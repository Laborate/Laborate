exports.create = function(req, res, next) {
    if(req.param("name")) {
        req.models.users.groups.create({
            name: req.param("name"),
            description: req.param("description"),
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
    req.models.users.groups.find({
        pub_id: req.param("group"),
        owner_id: req.session.user.id
    }, function(error, groups) {
        groups[0].remove();

        if(!error) {
            res.redirect("/groups/");
        } else {
            res.error(200, "Failed To Remove Group", error);
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
                    res.error(200, "Failed To Leave Group", errors);
                }
            });
        } else {
            res.error(401, null, error);
        }
    });
}
