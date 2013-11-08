/* Modules: NPM */
var rand = require("generate-key");

exports.token = function(req, res, next) {
    req.google.auth_url(function(url) {
        req.session.google_oauth = req.param("name");
        res.redirect(url);
    });
}

exports.add_token = function(req, res, next) {
    if(req.param("code")) {
        req.google.get_token(req.param("code"), function (error, tokens) {
            req.models.users.get(req.session.user.id, function(error, user) {
                var location = rand.generateKey(10);
                req.session.user.google[location] = tokens;
                req.session.user.locations[location] = {
                    name: req.session.google_oauth,
                    type: "google"
                };
                user.save({
                    google: req.session.user.google,
                    locations: req.session.user.locations
                });
                delete req.session.google_oauth;
                req.session.save();
                res.redirect(req.session.last_page || "/account/settings/");
            });
        });
    } else {
        res.redirect(req.session.last_page || "/account/settings/");
    }
};

exports.refresh_token = function(req, location, token, next) {
    req.models.users.get(req.session.user.id, function(error, user) {
        req.session.user.google[location].access_token = token;
        user.save({ google: req.session.user.google }, next);
        req.session.save();
    });
}

exports.remove_token = function(req, res, next) {
    if(Object.keys(req.session.user.google).length != 0) {
        req.models.users.get(req.session.user.id, function(error, user) {
            delete req.session.user.google[req.param("location")];
            delete req.session.user.locations[req.param("location")];
            user.save({
                google: req.session.user.google,
                locations: req.session.user.locations
            });
            req.session.save();
            res.redirect("/account/settings/");
        });
    } else {
        res.redirect("/account/settings/");
    }
};

exports.contents = function(req, res, next, refreshed) {
    if(!$.isEmptyObject(req.session.user.bitbucket)) {
        var _this = this;
        req.google.contents(
            req.session.user.google[req.param("0")],
            req.param("1"),
            function(error, results) {
                if((error || typeof results == "string") && !refreshed) {
                    req.google.refresh_token(function(token) {
                        _this.refresh_token(req, req.param("0"), token, function() {
                            _this.contents(req, res, next, true);
                        });
                    });
                } else {
                    res.json(results);
                }

            }
        );
    }
}
