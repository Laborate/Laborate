module.exports = function(crsf, basicAuth) {
    return function(req, res, next) {
        if(req.session.allowed) {
            finish(req, res, next, crsf, basicAuth);
        } else {
            if(req.host) {
                if(req.verified) {
                    req.session.organization = req.fake.organization;
                    finish(req, res, next, crsf, basicAuth);
                } else {
                    req.models.organizations.one({
                        dns: req.host
                    }, function(error, organization) {
                        if(!error && organization) {
                            req.session.organization = organization;
                            finish(req, res, next, crsf, basicAuth);
                        } else {
                            res.send(403);
                            req.error.capture(error);
                        }
                    });
                }
            } else {
                res.send(403);
                req.error.capture(req);
            }
        }
    }
}

function finish(req, res, next, crsf, basicAuth) {
    if(
        !req.robot &&
        !(/^\/webhook\/.*/.exec(req.url)) &&
        !(/^\/api\/.*/.exec(req.url))
    ) {
        if(!config.general.production && !$.isEmptyObject(config.development.basicAuth)) {
            crsf(req, res, function() {
                basicAuth(function(username, password) {
                    return (config.development.basicAuth[username] == password);
                })(req, res, function() {
                    req.session.allowed = true;
                    req.session.save();
                    next();
                });
            });
        } else {
            req.session.allowed = true;
            req.session.save();
            crsf(req, res, next);
        }
    } else {
        req.session.allowed = true;
        req.session.save();
        next();
    }
}
