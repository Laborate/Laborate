exports.index = function(req, res) {
    async.parallel({
        laborators: function(callback) {
            var users = [];
            var screen_names = [];
            var counter = 0;

            req.models.users.count(function(error, count) {
                async.until(
                    function() {
                        return (counter > 14) || (counter > count);
                    },
                    function(next) {
                        req.models.users.find({
                            id: req.db.tools.ne((req.session.user) ? req.session.user.id : null),
                            admin: false
                        })
                        .only(["screen_name", "email"])
                        .skip(Math.floor(Math.random() * count))
                        .limit(1)
                        .run(function(error, user) {
                            if(!error && !user.empty && screen_names.indexOf(user[0].screen_name) == -1) {
                                counter++;
                                users.push(user[0]);
                                screen_names.push(user[0].screen_name);
                            }

                            next(error);
                        });
                    },
                    function(errors) {
                        callback(errors, users);
                    }
                )
            });
        },
        admins: function(callback) {
            req.models.users.find({
                admin: true
            }).limit(3).run(callback);
        }
    }, function(errors, data) {
        if(!errors) {
            res.renderOutdated('landing/index', {
                title: "Collaborate Anywhere",
                user: req.session.user,
                laborators: data.laborators,
                admins: data.admins,
                js: clientJS.renderTags("landing", "codemirror"),
                css: clientCSS.renderTags("backdrop", "landing", "codemirror"),
                backdrop: req.backdrop(),
                pageTrack: false,
                title_first: false
            });
        } else {
            res.error(500, null, errors, { home: false });
        }
    });
};
