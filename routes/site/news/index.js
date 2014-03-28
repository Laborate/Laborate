exports.index = function(req, res, next) {
    req.models.posts.tags.find({
        explict: false
    }).limit(15).only("name").run(function(error, tags) {
        res.renderOutdated('news/index', {
            title: "News Feed",
            header: "news",
            user: req.session.user || req.fake_user,
            allow_replies: false,
            js: clientJS.renderTags("news", "highlight"),
            css: clientCSS.renderTags("news", "highlight"),
            description: config.descriptions.news.sprintf([
                $.map(tags, function(tag) {
                    return tag.name;
                }).join(", ")
            ])
        });

        req.error.capture(error);
    });
}

exports.post = function(req, res, next) {
    var user = req.session.user || req.fake_user;

    req.models.posts.one({
         or: $.merge(
             [{
                 pub_id: req.param("post"),
                 group_id: null
             }],
             $.map(user.groups, function(group) {
                return {
                    pub_id: req.param("post"),
                    group_id: group.id
                }
            })
        )
    }, function(error, post) {
        if(!error && post) {
            res.locals.favicons.graph = post.owner.gravatar;

            res.renderOutdated('news/post', {
                title: "News Feed",
                header: "news",
                type: "article",
                posts: [post],
                user: user,
                search: false,
                allow_replies: true,
                limit_replies: false,
                js: clientJS.renderTags("news", "highlight"),
                css: clientCSS.renderTags("news", "highlight"),
                description: config.descriptions.news.sprintf([
                    $(post.content).text()
                ]),
                config: {
                    auto_pull: false
                }
            });
        } else {
            res.redirect("/news/");
        }
    });
}

exports.posts = function(req, res, next) {
    var tags = req.param("tags") || [];
    var page = parseInt(req.param("page"));

    req.models.users.groups.one({
        pub_id: req.param("group")
    }, function(error, group) {
        if(req.session.user && group) {
            var group = (!$.map(req.session.user.groups, function(group) {
                if(group.pub_id == req.param("group")) {
                    return true;
                }
            }).empty) ? group.id : null;
        } else {
            var group = null;
        }


        if(tags.empty) {
            req.models.posts.page(page).order("-created").where({
                parent_id: null,
                group_id: group
            }).run(function(error, posts) {
                if(!error && !posts.empty) {
                    res.renderOutdated('news/posts/index', {
                        posts: posts,
                        user: req.session.user || req.fake_user,
                        limit_replies: true,
                        allow_replies: false
                    });
                } else {
                    res.error(404, null, error);
                }
            });
        } else {
            var total_posts = [];
            var total_post_ids = [];

            req.models.posts.tags.page(page).where({
                or: $.map(tags, function(tag) {
                    return {
                        name: tag
                    }
                })
            }).run(function(error, tags) {
                if(!error && tags) {
                    async.each(tags, function(tag, next) {
                        tag.getPosts().order("-created").where({
                            parent_id: null,
                            group_id: group
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
                    }, function(errors) {
                        if(!errors && !total_posts.empty) {
                            res.renderOutdated('news/posts/index', {
                                posts: total_posts,
                                user: req.session.user || req.fake_user,
                                limit_replies: true,
                                allow_replies: false
                            });
                        } else {
                            res.error(404, null, errors);
                        }
                    });
                } else {
                    res.error(404, null, errors);
                }
            });
        }
    });
}

exports.preview = function(req, res, next) {
    res.send(req.markdown(req.param("content")));
}

exports.create = function(req, res, next) {
    req.models.users.groups.one({
        pub_id: req.param("group")
    }, function(error, group) {
        req.models.posts.create({
            content: req.markdown(req.param("content")),
            markdown: req.param("content"),
            owner_id: req.session.user.id,
            group_id: ((!error && group) ? group.id : null)
        }, function (error, post) {
            if(!error && post) {
                var tags = req.markdown_links("tags", req.param("content"));

                async.each(tags, function(name, next) {
                    req.models.posts.tags.findOrCreate(name, function(error, tag) {
                        post.addTags(tag, next);
                    });
                }, function(errors) {
                    if(!errors) {
                        req.models.posts.get(post.id, function(error, post) {
                            if(!error && post) {
                                res.renderOutdated('news/posts/index', {
                                    posts: [post],
                                    user: req.session.user,
                                    limit_replies: true,
                                    allow_replies: false
                                });
                            } else {
                                res.error(404, null, error);
                            }
                        });
                    } else {
                        res.error(404, null, error);
                    }
                });
            } else {
                res.error(404, null, error);
            }
        });
    });
}

exports.reply = function(req, res, next) {
    async.waterfall([
        function(callback) {
            req.models.posts.one({
                pub_id: req.param("parent")
            }, ["id"], function(error, post) {
                callback(error, ((post) ? post.id : null));
            });
        },
        function(parent, callback) {
            req.models.posts.create({
                content: req.markdown(req.param("content")),
                markdown: req.param("content"),
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
                        post.addTags(tag, req.error.capture)
                        post.parent.addTags(tag, req.error.capture);
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
                limit_replies: false,
            });
        } else {
            res.error(404, null, errors);
        }
    });
}

exports.like = function(req, res, next) {
    req.models.posts.one({
        pub_id: req.param("post")
    }, function(error, post) {
        if(!error && post) {
            req.models.users.get(req.session.user.id, function(error, user) {
                if(!error && user) {
                    post.getLikes(user.id).only("id").run(function(error, likes) {
                        if(!error) {
                            var liked = !likes.empty;
                            var count = post.likes.length;

                            if(!liked) {
                                post.addLikes(user, req.error.capture);
                                count++;

                            } else {
                                post.removeLikes(user, req.error.capture);
                                count--;
                            }

                            res.json({
                                success: true,
                                like: !liked,
                                count: count
                            });
                        } else {
                            res.error(404, null, error);
                        }
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

exports.share = function(req, res, next) {
    req.models.posts.one({
        pub_id: req.param("post")
    }, function(error, post) {
        if(!error && post) {
            post.shortner(function(error, url) {
                if(!error && url) {
                    res.renderOutdated('news/posts/share', {
                        post: post,
                        share: url,
                        host: req.host,
                        host_full: req.session.server
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
