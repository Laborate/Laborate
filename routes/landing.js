exports.index = function(req, res) {
    res.renderOutdated('landing/index', {
        title: "Collaborate Anywhere",
        user: req.session.user,
        js: clientJS.renderTags("landing", "codemirror", "codemirror-movie"),
        css: clientCSS.renderTags("backdrop", "landing", "codemirror", "codemirror-movie"),
        backdrop: req.backdrop(),
        pageTrack: false,
        title_first: false
    });

    if(!req.session.landing) {
        req.session.landing = true;
        req.session.save();
    }
};
