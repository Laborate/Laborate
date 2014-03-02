exports.index = function(req, res, next) {
    res.renderOutdated('news/index', {
        title: "News Feed",
        header: "news",
        user: req.session.user,
        config: {
            auto_pull: true
        },
        js: clientJS.renderTags("news", "new-header", "highlight"),
        css: clientCSS.renderTags("news", "new-header", "highlight")
    });
}

exports.post = function(req, res, next) {
    req.models.posts.find({
        pub_id: req.param("post"),
        parent_id: null
    }, function(error, posts) {
        if(!error && !posts.empty) {
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
            res.redirect("/news/");
        }
    });
}

exports.posts = function(req, res, next) {
    req.models.posts.pages(function (error, pages) {
        var page = parseInt(req.param("page"));

        if(!error && page >= 1 && page <= pages) {
            req.models.posts.page(page).order("-created").run(function(error, posts) {
                if(!error && posts) {
                    res.renderOutdated('news/posts/index', {
                        posts: posts,
                        user: req.session.user,
                        restrict: true
                    });
                } else {
                    res.error(404, null, error);
                }
            });
        } else {
            res.error(404, null, error);
        }
    });
}

exports.preview = function(req, res, next) {
    res.send(req.markdown(req.param("content")));
}

exports.create = function(req, res, next) {
    req.models.posts.create({
        content: req.markdown(req.param("content")),
        owner_id: req.session.user.id
    }, function (error, post) {
        if(!error && post) {
            req.models.posts.get(post.id, function(error, post) {
                if(!error && post) {
                    res.renderOutdated('news/posts/index', {
                        posts: [post],
                        user: req.session.user,
                        restrict: true,
                    });
                } else {
                    res.error(404, null, error);
                }
            });
        } else {
            res.error(404, null, error);
        }
    });
}


exports.reply = function(req, res, next) {
    async.waterfall([
        function(callback) {
            if(req.param("parent")) {
                req.models.posts.find({
                    pub_id: req.param("parent")
                }).only("id").run(function(error, posts) {
                    callback(error, ((!posts.empty) ? posts[0].id : null));
                });
            } else {
                callback(null, null);
            }
        },
        function(parent, callback) {
            req.models.posts.create({
                content: req.markdown(req.param("content")),
                owner_id: req.session.user.id,
                parent_id: parent
            }, callback);
        },
        function(post, callback) {
            req.models.posts.get(post.id, callback);
        }
    ], function(errors, post) {
        if(!errors && post) {
            res.renderOutdated('news/posts/reply', {
                child: post,
                user: req.session.user,
                restrict: false,
            });
        } else {
            res.error(404, null, error);
        }
    });
}
