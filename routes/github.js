/* Modules: NPM */
var async = require("async");

/* Modules: Custom */
var aes = require('../lib/core/aes');
var github_lib = require("../lib/github");
var user_documents_mysql = require("../lib/mysql/users/documents");

exports.add_token = function(req, res) {
    if(req.param("code")) {
        github_lib.get_token(req.param("code"), function (error, token) {
            req.models.users.get(req.session.user.id, function(error, user) {
                user.github = token;
                req.session.user = user;
                res.redirect("/account/settings/");
            });
        });
    } else {
        res.redirect("/account/settings/");
    }
};

exports.remove_token = function(req, res) {
    if(req.session.user.github) {
        req.models.users.get(req.session.user.id, function(error, user) {
            user.github = null;
            req.session.user = user;
            res.redirect("/account/settings/");
        });
    } else {
        res.redirect("/account/settings/");
    }
};

exports.repos = function(req, res) {
    if(req.session.user.github) {
        github_lib.repos(req.session.user.github, function(error, results) {
            if(!error) {
                res.json(results);
            } else {
                if(error.message == "Bad credentials") {
                    res.json({
                        success: false,
                        error_message: "Bad Github Oauth Token",
                        github_oath: github_lib.auth_url
                    });

                } else {
                    res.json({
                        success: false,
                        error_message: "Failed To Load Github Contents"
                    });
                }
            }
        });
    } else {
        res.json([]);
    }
};

exports.contents = function(req, res) {
    if(req.session.user.github) {
        github_lib.contents(req.session.user.github,
            req.session.user.code_locations[req.param("0")].github_repository,
            req.param("1"),
        function(error, results){
            if(!error) {
                switch(results.type) {
                    case "image":
                        res.writeHead(200, {
                            "Content-Type": "image/" +  results.extension,
                            "Content-disposition": "attachment; filename=" + results.name
                        });
                        res.end(results.contents, "binary");
                        break;

                    case "document":
                        path = (req.param("1").slice(-1) == "/") ? req.param("1").slice(0, -1) : req.param("1");
                        path = path.substr(0, path.lastIndexOf('/'));

                        req.models.documents.create({
                            name: results.name,
                            content: results.contents,
                            owner_id: req.session.user.id,
                            path: path,
                            location: req.param("0"),
                        }, function(error, document) {
                            if(!error) {
                                res.json({document: document.id});
                            } else {
                                res.json({
                                    success: false,
                                    error_message: "Failed To Create Document"
                                });
                            }
                        });
                        break;

                    case "directory":
                        res.json(results.contents);
                }
            } else {
                if(error.message == "Bad credentials") {
                    res.json({
                        success: false,
                        error_message: "Bad Github Oauth Token",
                        github_oath: github_lib.auth_url
                    });
                } else {
                    res.json({
                        success: false,
                        error_message: "Failed To Load Github Contents"
                    });
                }
            }
        });
    } else {
        res.json({
            success: false,
            error_message: "Github Oauth Token Required"
        });
    }
};
