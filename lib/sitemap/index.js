var sitemap = require('sitemap');

module.exports = function(req, callback) {
    var routes = [];
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
                        var route = config.sitemap.routes["default"];
                    }

                    routes.push({
                        url: path,
                        changefreq: route.freq,
                        priority: route.priority
                    });
                }
            }
        }

        if(key == (req.app.routes.get.length-1)) {
            sitemap.createSitemap ({
                hostname: req.session.server,
                cacheTime: config.sitemap.cacheTime,
                urls: routes
            }).toXML(callback);
        }
    });
}
