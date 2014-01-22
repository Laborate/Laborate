exports.index = function(req, res) {
    res.renderOutdated('landing/index', {
        title: "Collaborate Anywhere",
        js: clientJS.renderTags("landing"),
        css: clientCSS.renderTags("backdrop", "landing"),
        backdrop: req.backdrop(),
        pageTrack: false,
        title_first: false,
        config: {
            animate: !req.session.landing
        }
    });

    if(!req.session.landing) {
        req.session.landing = true;
        req.session.save();
    }
};
