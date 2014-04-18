exports.index = function(req, res, next) {
    if(req.param("user")) {
        req.models.users.find({
            screen_name: req.db.tools.like("%" + req.param("user") + "%")
        }, ["screen_name", "email"], 3, function(error, users) {
            if(!error && !users.empty) {
                res.json({
                    success: true,
                    users: $.map(users, function(user) {
                        return {
                            screen_name: user.screen_name,
                            gravatar: user.gravatar
                        }
                    })
                });
            } else {
                res.error(404, null, error);
            }
        });
    } else {
        res.json({
            success: true,
            users: []
        });
    }
}

exports.user = function(req, res, next) {
    req.models.users.one({
        screen_name: req.param("user")
    }, function(error, user){
        if(!error && user) {
            res.renderOutdated('users/index', {
                title: user.screen_name + " (" + user.name + ")",
                header: "users",
                header_class: "lighten",
                laborator: user,
                js: clientJS.renderTags("users", "backdrop"),
                css: clientCSS.renderTags("users", "backdrop"),
                backdrop: req.backdrop(),
                pageTrack: true
            });
        } else {
            res.error(404, null, error);
        }
    });
};
