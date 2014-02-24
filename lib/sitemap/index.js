var sitemap = require('sitemap');

module.exports = function(req, callback) {
    var routes = [];
    var defaults = config.sitemap.routes;

    async.parallel([
        function(callback) {
            $.each(req.app.routes.get, function(key, value) {
                var path = value.path;

                if(typeof path == "string") {
                    var branch = /\/(.*)/.exec(path);

                    if(path.indexOf(":") == -1 && branch) {
                        branch = branch[1].split("/")[0];

                        if(config.sitemap.ignore.indexOf(branch) == -1) {
                            if(branch in defaults) {
                                var route = defaults[branch];
                            } else {
                                var route = defaults.default;
                            }

                            routes.push({
                                url: (path.slice(-1) == "/") ? path : path + "/",
                                changefreq: route.freq,
                                priority: route.priority
                            });
                        }
                    }
                }

                if(req.app.routes.get.end(key)) callback();
            });
        },
        function(callback) {
            req.models.documents.find({
                private: false
            }, ["pub_id"], ["viewed", "Z"], function(error, documents) {
                 $.each(documents, function(key, document) {
                    routes.push({
                        url: "/editor/" + document.pub_id + "/",
                        changefreq: defaults.documents.freq,
                        priority: defaults.documents.priority,
                        lastmod: document.modified
                    });

                    if(documents.end(key)) callback();
                 });
            });
        },
        function(callback) {
            req.models.users.all(["pub_id"], ["name", "A"], function(error, users) {
                $.each(users, function(key, user) {
                    routes.push({
                        url: "/users/" + user.screen_name + "/",
                        changefreq: defaults.default.freq,
                        priority: defaults.default.priority,
                        lastmod: user.modified
                    });

                    if(users.end(key)) callback();
                });
            });
        }
    ], function() {
        sitemap.createSitemap ({
            hostname: req.session.server,
            cacheTime: config.sitemap.cacheTime,
            urls: routes
        }).toXML(callback);
    });
}
