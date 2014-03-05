exports.posts = function(req, res, next) {
    req.models.posts.tags.findOrCreate(req.param("tag"), function(error, tag) {
        tag.getPosts(function(error, posts) {
            if(!error) {
                res.renderOutdated('news/post', {
                    title: "News Feed",
                    header: "news",
                    posts: posts,
                    user: req.session.user,
                    config: {
                        auto_pull: false
                    },
                    restrict: false,
                    js: clientJS.renderTags("news", "new-header", "highlight"),
                    css: clientCSS.renderTags("news", "new-header", "highlight")
                });
            } else {
                res.error(404, null, error);
            }
        });
    });
}

exports.create = function(req, res, next) {
    req.models.posts.tags.findOrCreate(req.param("tag"), function(error, tag) {
        res.renderOutdated('news/filters/tag', {
            tag: tag
        });
    });
}
