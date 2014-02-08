var async = require('async');

exports.index = function(req, res) {
    async.parallel({
        laborators: function(callback) {
            req.models.users.find({
                id: req.db.tools.ne((req.session.user) ? req.session.user.id : null),
                admin: false
            }).limit(15).run(callback);
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
