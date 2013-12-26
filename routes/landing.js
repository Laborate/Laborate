exports.index = function(req, res) {
    res.renderOutdated('landing/index', {
        title: '',
        js: clientJS.renderTags("landing"),
        css: clientCSS.renderTags("backdrop", "landing"),
        backdrop: req.backdrop(),
        pageTrack: false
    });
};
