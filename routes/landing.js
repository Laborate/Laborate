exports.index = function(req, res) {
    res.renderOutdated('landing/index', {
        title: "Collaborate Anywhere",
        js: clientJS.renderTags("landing", "codemirror"),
        css: clientCSS.renderTags("backdrop", "landing", "codemirror"),
        backdrop: req.backdrop(),
        pageTrack: false,
        title_first: false
    });

    if(!req.session.landing) {
        req.session.landing = true;
        req.session.save();
    }
};
