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
        req.google.get_token(req.param("code"), function (error, oauth) {
            req.models.users.get(req.session.user.id, function(error, user) {
                var location = rand.generateKey(10);
                req.session.user.google[location] = oauth;
                req.session.user.locations[location] = {
                    name: req.session.google_oauth,
                    type: "google"
                };
                user.save({
                    google: req.session.user.google,
                    locations: req.session.user.locations
                });
                delete req.session.google_oauth;
                res.redirect(req.session.last_page || "/account/settings/");
            });
        });
    } else {
        res.redirect(req.session.last_page || "/account/settings/");
    }
};

exports.remove_token = function(req, res, next) {
    if(req.session.user.google.length != 0) {
        req.models.users.get(req.session.user.id, function(error, user) {
            delete req.session.user.google[req.param("location")];
            delete req.session.user.locations[req.param("location")];
            user.save({
                google: req.session.user.google,
                locations: req.session.user.locations
            });
            res.redirect("/account/settings/");
        });
    } else {
        res.redirect("/account/settings/");
    }
};

exports.contents = function(req, res, next) {
    req.google.contents(
        req.session.user.google[req.param("0")],
        req.param("1"),
        function(error, results) {
            res.error(200, "Failed To Load Google Drive Contents");
        }
    );
}
