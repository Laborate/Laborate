exports.posts = function(req, res, next) {
    var user = req.session.user || req.fake.user;

    req.models.posts.tags.findOrCreate(req.param("tag"), function(error, tag) {
        tag.getPosts().limit(15).where({
            parent_id: null,
            or: $.merge(
                 [{
                     group_id: null
                 }],
                 $.map(user.groups, function(group) {
                    return {
                        group_id: group.id
                    }
                })
            )
        }).run(function(error, posts) {
            if(!error) {
                res.renderOutdated('news/post', {
                    title: "News Feed",
                    header: "news",
                    user: user,
                    posts: false,
                    search: req.param("tag"),
                    js: clientJS.renderTags("news", "highlight"),
                    css: clientCSS.renderTags("news", "highlight"),
                    description: config.descriptions.news.sprintf([
                        $.map(posts.slice(0, 5), function(post) {
                            return $.trim($(post.content).text().slice(0, 15)) + "...";
                        }).join(", ")
                    ]),
                    config: {
                        tags: [req.param("tag")]
                    }
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
