exports.add_token = function(req, res, next) {
    if(req.param("code")) {
        req.github.get_token(req.param("code"), function (error, token) {
            req.models.users.get(req.session.user.id, function(error, user) {
                user.github = token;
                req.session.user = user;
                req.session.save();
                res.redirect("/account/settings/");
            });
        });
    } else {
        res.redirect("/account/settings/");
    }
};

exports.remove_token = function(req, res, next) {
    if(req.session.user.github) {
        req.models.users.get(req.session.user.id, function(error, user) {
            user.github = null;
            req.session.user = user;
            req.session.save();
            res.redirect("/account/settings/");
        });
    } else {
        res.redirect("/account/settings/");
    }
};

exports.repos = function(req, res, next) {
    if(req.session.user.github) {
        req.github.repos(req.session.user.github, function(error, results) {
            if(!error) {
                res.json(results);
            } else {
                if(error.message == "Bad credentials") {
                    res.error(200, "Bad Github Oauth Token");
                } else {
                    res.error(200, "Failed To Load Github Contents");
                }
            }
        });
    } else {
        res.json([]);
    }
};

exports.contents = function(req, res, next) {
    if(req.session.user.github) {
        req.github.contents(req.session.user.github,
            req.session.user.locations[req.param("0")].repository,
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
                                res.json({document: document.id});
                            } else {
                                res.error(200, "Failed To Create Document");
                            }
                        });
                        break;

                    case "directory":
                        res.json(results.contents);
                        break;
                }
            } else {
                if(error.message == "Bad credentials") {
                    res.error(200, "Bad Github Oauth Token");
                } if(error.message == "This repository is empty.") {
                    res.json([]);
                } else {
                    res.error(200, "Failed To Load Github Contents");
                }
            }
        });
    } else {
        res.error(200, "Github Oauth Token Required");
    }
};

exports.commit = function(req, res, next) {
    if(req.session.user.github) {
        req.models.documents_roles.find({
            user_id: req.session.user.id,
            document_id: req.param("document")
        }, function(error, documents) {
            if(!error && documents.length == 1 && documents[0].permission_id != 3) {
                var document = documents[0].document;
                req.github.commit(req.session.user.github,
                    req.session.user.locations[document.location].repository,
                    req.session.user.locations[document.location].branch,
                    (document.path) ? document.path + "/" + document.name : document.name,
                    (document.content) ? document.content.join("\n") : "",
                    req.param("message"),
                function(errors) {
                    if(!errors) {
                        res.json({ success: true });
                    } else {
                        res.error(200, "Failed To Commit File");
                    }
                });
            } else {
                res.error(200, "Failed To Commit File");
            }
        });
    } else {
        res.error(200, "Failed To Commit File");
    }
}
