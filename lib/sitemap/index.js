var async = require('async');
var sitemap = require('sitemap');

module.exports = function(req, callback) {
    var routes = [];
    var defaults = config.sitemap.routes["default"];

    async.parallel([
        function(callback) {
            $.each(req.app.routes.get, function(key, value) {
                var path = value.path;

                if(typeof path == "string") {
                    var branch = /\/(.*)/.exec(path);

                    if(path.indexOf(":") == -1 && branch) {
                        branch = branch[1].split("/")[0];

                        if(config.sitemap.ignore.indexOf(branch) == -1) {
                            if(branch in config.sitemap.routes) {
                                var route = config.sitemap.routes[branch];
                            } else {
                                var route = defaults;
                            }

                            routes.push({
                                url: path,
                                changefreq: route.freq,
                                priority: route.priority
                            });
                        }
                    }
                }

                if(req.app.routes.get.end(key)) {
                    callback();
                }
            });
        },
        function(callback) {
            req.models.documents.find({
                private: false
            }, function(error, documents) {
                 $.each(documents, function(key, document) {
                    routes.push({
                        url: "/editor/" + document.pub_id + "/",
                        changefreq: defaults.freq,
                        priority: defaults.priority
                    });

                    if(documents.end(key)) {
                        callback();
                    }
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
