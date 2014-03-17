var sitemap = require('sitemap');

module.exports = function(req, callback) {
    var routes = [];
    var defaults = config.sitemap.routes;

    async.series([
        function(callback) {
            async.each(req.app.routes.get, function(value, next) {
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

                next()
            }, callback);
        },
        function(callback) {
            req.redis.get("sitemap", function(error, data) {
                routes = $.merge(routes, JSON.parse(data));
                callback();
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
