exports.index = function(req, res) {
    res.renderOutdated('auth/login/index', {
        title: 'Login',
        js: clientJS.renderTags("backdrop", "crypto"),
        css: clientCSS.renderTags("backdrop"),
        backdrop: req.backdrop(),
        pageTrack: false
    });
};
