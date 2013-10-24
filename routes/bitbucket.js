exports.token = function(req, res, next) {
    req.bitbucket.auth_url(function(error, url, secret) {
        req.session.bitbucket_oauth = secret;
        res.redirect(url);
    });
}

exports.add_token = function(req, res, next) {
    if(req.param("oauth_token") && req.param("oauth_verifier")) {
        req.bitbucket.get_token(
            req.param("oauth_token"), req.session.bitbucket_oauth, req.param("oauth_verifier"),
            function (error, token) {
                req.models.users.get(req.session.user.id, function(error, user) {
                    delete req.session.bitbucket_oauth;
                    req.session.user.bitbucket = token;
                    user.save({ bitbucket: req.session.user.bitbucket });
                    res.redirect(req.session.last_page || "/account/settings/");
                });
            }
        );
    } else {
        res.redirect(req.session.last_page || "/account/settings/");
    }
};

exports.remove_token = function(req, res, next) {
    if(req.session.user.bitbucket) {
        req.models.users.get(req.session.user.id, function(error, user) {
            req.session.user.bitbucket = null;
            user.save({ bitbucket: req.session.user.bitbucket });
            res.redirect("/account/settings/");
        });
    } else {
        res.redirect("/account/settings/");
    }
};
