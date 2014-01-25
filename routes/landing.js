exports.index = function(req, res) {
    req.models.users.all({
        id: req.db.tools.ne((req.session.user) ? req.session.user.id : null)
    }).limit(15).orderRaw("rand()").run(function(error, users) {
        res.renderOutdated('landing/index', {
            title: "Collaborate Anywhere",
            user: req.session.user,
            laborators: users,
            js: clientJS.renderTags("landing", "codemirror", "codemirror-movie"),
            css: clientCSS.renderTags("backdrop", "landing", "codemirror", "codemirror-movie"),
            backdrop: req.backdrop(),
            pageTrack: false,
            title_first: false
        });
    });

    if(!req.session.landing) {
        req.session.landing = true;
        req.session.save();
    }
};
