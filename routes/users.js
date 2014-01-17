exports.index = function(req, res, next) {
    req.models.users.find({
        screen_name: req.param("user")
    }, function(error, users){
        if(!error && !users.empty) {
            res.renderOutdated('users/index', {
                title: users[0].name,
                user: users[0],
                js: clientJS.renderTags("users", "backdrop"),
                css: clientCSS.renderTags("users", "backdrop"),
                backdrop: req.backdrop(),
                pageTrack: true,
                loggedIn: !!req.session.user
            });
        } else {
            res.error(404, null, error);
        }
    });
};
