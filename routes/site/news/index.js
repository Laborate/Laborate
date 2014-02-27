exports.index = function(req, res, next) {
    res.renderOutdated('news/index', {
        title: "News Feed",
        page: "news",
        user: req.session.user,
        js: clientJS.renderTags("news", "new-header"),
        css: clientCSS.renderTags("news", "new-header")
    });
}
