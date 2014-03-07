exports.posts = function(req, res, next) {
    req.models.posts.tags.findOrCreate(req.param("tag"), function(error, tag) {
        tag.getPosts().order("-created").where({
                parent_id: null
        }).run(function(error, posts) {
            if(!error && !posts.empty) {
                res.renderOutdated('news/post', {
                    title: "News Feed",
                    header: "news",
                    posts: posts,
                    user: req.session.user || req.fake_user,
                    config: {
                        auto_pull: false
                    },
                    restrict: false,
                    js: clientJS.renderTags("news", "new-header", "highlight"),
                    css: clientCSS.renderTags("news", "new-header", "highlight")
                });
            } else {
                res.redirect("/news/");
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
