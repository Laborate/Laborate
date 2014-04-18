exports.reload = function(req, res, next) {
    if(req.session.user) {
        req.models.users.get(req.session.user.id, function(error, user) {
            req.session.user = user;
            req.session.save();
            lib.error.capture(error);
            next();
        });
    } else {
        req.routes.auth.util.loginGenerate(req, res, next);
    }
}

exports.organization = function(req, res, next) {
    if(req.session.organization) {
        if(["register", "verify", "reset"].indexOf(req.url.split("/")[1]) != -1) {
            if(!req.session.organization.register) {
                res.error(404);
            } else {
                next();
            }
        } else {
            next();
        }
    } else {
        next();
    }
}

exports.shortner = function(req, res, next) {
    req.models.shortner.one({
        pub_id: req.param("code")
    }, function(error, shortned) {
        if(!error && shortned) {
            res.redirect(shortned.url);
        } else {
            res.error(404, null, error);
        }
    });
}

exports.sitemap = function(req, res, next) {
    req.sitemap(req, function(xml) {
        res.set('Content-Type', 'application/xml');
        res.send(xml);
    });
}

exports.robots = function(req, res, next) {
    res.set('Content-Type', 'text/plain');
    res.renderOutdated("robots", {
        disallow: config.robots
    });
}
