exports.core = function(crsf, basicAuth) {
    return function(req, res, next) {
        if(req.session.allowed) {
            exports.finish(req, res, next, crsf, basicAuth);
        } else {
            if(req.host.split(".").slice(-2).join(".") == config.general.host) {
                req.session.organization = { register: true, icons: {} };
                exports.finish(req, res, next, crsf, basicAuth);
            } else {
                req.models.organizations.find({
                    dns: req.host
                }, function(error, organizations) {
                    if(!error && organizations.length == 1) {
                        req.session.organization = organizations[0];
                        exports.finish(req, res, next, crsf, basicAuth);
                    } else {
                        res.send(403);
                        blank_function(error);
                    }
                });
            }
        }
    }
}

exports.finish = function(req, res, next, crsf, basicAuth) {
    if(!(/^\/webhook\/.*/.exec(req.url))) {
        if(!config.general.production && Object.keys(config.development.basicAuth).length != 0) {
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
