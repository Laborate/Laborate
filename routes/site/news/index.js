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
    var tags = req.param("tags") || [];
    var groups = req.param("groups") || [];
    var page = parseInt(req.param("page"));

    if(tags.empty && groups.empty) {
        req.models.posts.page(page).order("-created").where({
            parent_id: null
        }).run(function(error, posts) {
            if(!error && !posts.empty) {
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
        var total_posts = [];
        var total_post_ids = [];

        async.parallel([
            //Get Posts Related To Tags
            function(callback) {
                req.models.posts.tags.page(page).order("-created").where({
                    or: $.map(tags, function(tag) {
                        return {
                            name: tag
                        }
                    })
                }).run(function(error, tags) {
                    if(!error && tags) {
                        async.each(tags, function(tag, next) {
                            tag.getPosts().where({
                                parent_id: null
                            }).run(function(error, posts) {
                                if(!error && posts) {
                                    async.each(posts, function(post, move) {
                                        if(total_post_ids.indexOf(post.pub_id) == -1) {
                                            total_posts.push(post);
                                            total_post_ids.push(post.pub_id);
                                        }

                                        move();
                                    }, next);
                                } else {
                                    next(error);
                                }
                            });
                        }, callback);
                    } else {
                        callback(error);
                    }
                });
            }
        ], function(errors) {
            if(!errors && !total_posts.empty) {
                res.renderOutdated('news/posts/index', {
                    posts: total_posts,
                    user: req.session.user,
                    restrict: true
                });
            } else {
                res.error(404, null, errors);
            }
        });
    }
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
                    var tags = req.markdown_links("tags", req.param("content"));

                    if(!tags.empty) {
                        $.each(tags, function(index, name) {
                            req.models.posts.tags.findOrCreate(name, function(error, tag) {
                                post.addTags(tag, req.error.capture);
                            });
                        });
                    }

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
        },
        function(post, callback) {
            var tags = req.markdown_links("tags", req.param("content"));

            if(!tags.empty) {
                $.each(tags, function(index, name) {
                    req.models.posts.tags.findOrCreate(name, function(error, tag) {
                        post.addTags(tag, req.error.capture);
                    });
                });
            }

            callback(null, post);
        },
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

exports.like = function(req, res, next) {
    req.models.posts.find({
        pub_id: req.param("post")
    }, function(error, posts) {
        if(!error && !posts.empty) {
            var post = posts[0];
            var like = (req.param("like") == "true");

            req.models.users.get(req.session.user.id, function(error, user) {
                if(!error && user) {
                    if(like) {
                        post.addLikes(user, req.error.capture);
                    } else {
                        post.removeLikes(user, req.error.capture);
                    }

                    res.json({
                        success: true
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
