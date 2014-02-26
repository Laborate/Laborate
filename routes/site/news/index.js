exports.index = function(req, res, next) {
    res.renderOutdated('news/index', {
        title: "News Feed",
        user: req.session.user,
        js: clientJS.renderTags("news"),
        css: clientCSS.renderTags("news")
    });
}
