require('../init')("sitemap", function() {
    var _this = this;
    var routes = [];
    var defaults = config.sitemap.routes;

    async.series([
        function(callback) {
            _this.models.documents.find({
                private: false
            }, ["pub_id"], function(error, documents) {
                 async.each(documents, function(document, next) {
                    routes.push({
                        url: "/editor/" + document.pub_id + "/",
                        changefreq: defaults.documents.freq,
                        priority: defaults.documents.priority
                    });

                    next();
                 }, callback);
            });
        },
        function(callback) {
            _this.models.users.all(["screen_name"], function(error, users) {
                async.each(users, function(user, next) {
                    routes.push({
                        url: "/users/" + user.screen_name + "/",
                        changefreq: defaults.default.freq,
                        priority: defaults.default.priority
                    });

                    next();
                }, callback);
            });
        },
        function(callback) {
            _this.models.posts.find({
                group_id: null
            }, ["pub_id"], function(error, posts) {
                async.each(posts, function(post, next) {
                    routes.push({
                        url: "/news/" + post.pub_id + "/",
                        changefreq: defaults.posts.freq,
                        priority: defaults.posts.priority
                    });

                    next();
                }, callback);
            });
        },
        function(callback) {
            _this.models.posts.tags.all(["name"], function(error, tags) {
                async.each(tags, function(tag, next) {
                    routes.push({
                        url: "/news/tags/" + tag.name + "/",
                        changefreq: defaults.tags.freq,
                        priority: defaults.tags.priority
                    });

                    next();
                }, callback);
            });
        }
    ], function() {
        _this.redis.set("sitemap", JSON.stringify(routes), _this.finish);
    });
});
