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
            function (error, oauth) {
                req.models.users.get(req.session.user.id, function(error, user) {
                    delete req.session.bitbucket_oauth;
                    req.session.user.bitbucket = oauth;
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

exports.repos = function(req, res, next) {
    if(req.session.user.bitbucket) {
        req.bitbucket.repos(req.session.user.bitbucket, function(error, results) {
            if(!error) {
                res.json({
                    success: true,
                    repos: results
                });
            } else {
                if(error.message == "Bad credentials") {
                    res.error(200, "Bad Bitbucket Oauth Token", true, error);
                } else {
                    res.error(200, "Failed To Load Bitbucket Repos", true, error);
                }
            }
        });
    } else {
        res.error(200, "Bad Bitbucket Oauth Token");
    }
};

exports.contents = function(req, res, next) {
    if(!$.isEmptyObject(req.session.user.bitbucket)) {
        req.bitbucket.contents(req.session.user.bitbucket,
            req.session.user.locations[req.param("0")].repository,
            req.session.user.locations[req.param("0")].branch,
            req.param("1"),
        function(error, results) {
            if(!error) {
                switch(results.type) {
                    case "image":
                        res.attachment(results.name);
                        res.end(results.contents, "binary");
                        break;

                    case "document":
                        path = (req.param("1").slice(-1) == "/") ? req.param("1").slice(0, -1) : req.param("1");
                        path = path.substr(0, path.lastIndexOf('/'));

                        req.models.documents.create({
                            name: results.name,
                            content: results.contents.split("\n"),
                            owner_id: req.session.user.id,
                            path: path,
                            location: req.param("0"),
                        }, function(error, document) {
                            if(!error) {
                                res.json({
                                    success: true,
                                    document: document.pub_id
                                });
                            } else {
                                res.error(200, "Failed To Create Document", true, error);
                            }
                        });
                        break;

                    case "directory":
                        res.json({
                            success: true,
                            contents: $.map(results.contents, function(item) {
                                if(item){
                                    item.type = function(type, extension) {
                                        if(type == "file") {
                                            if(!extension) {
                                                return "file";
                                            }  else if(["png", "gif", "jpg", "jpeg", "ico", "wbm"].indexOf(extension) > -1) {
                                                return "file-image";
                                            } else if(["html", "jade", "ejs", "erb", "md"].indexOf(extension) > -1) {
                                                return "file-template";
                                            } else if(["zip", "tar", "bz", "bz2", "gzip", "gz"].indexOf(extension) > -1) {
                                                return "file-zip";
                                            } else {
                                                return "file-script";
                                            }
                                        } else if(type == "dir") {
                                            return "folder";
                                        } else if(type == "symlink") {
                                            return "folder-symlink";
                                        } else {
                                            return type;
                                        }
                                    }(item.type, item.extension);
                                    return item;
                                }
                            })
                        });
                        break;
                }
            } else {
                if(error.message == "Bad credentials") {
                    res.error(200, "Bad Bitbucket Oauth Token", true, error);
                } else {
                    res.error(200, "Failed To Load Bitbucket Repos", true, error);
                }
            }
        });
    } else {
        res.error(200, "Bad Bitbucket Oauth Token");
    }

}
