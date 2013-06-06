/* Modules: NPM */
var async = require("async");

/* Modules: Custom */
var aes = require('../lib/core/aes');
var github_lib = require("../lib/github");
var user_mysql = require("../lib/mysql/users");

exports.add_token = function(req, res) {
    if(req.param("code")) {
        async.series({
            add_token: function(callback) {
                github_lib.get_token(req.param("code"), function (error, token) {
                    req.session.user.github = token;
                    token = aes.encrypt(token, req.session.user.email)
                    user_mysql.user_github_token(callback, req.session.user.id, token);
                });
            }
        }, function(error, results){
            res.redirect("/account/settings/");
        });
    } else {
        res.redirect("/account/settings/");
    }
};

exports.remove_token = function(req, res) {
    if(req.session.user.github) {
        async.series({
            remove_token: function(callback) {
                req.session.user.github = null;
                user_mysql.user_github_token(callback, req.session.user.id, null);
            }
        }, function(error, results){
            res.redirect("/account/settings/");
        });
    } else {
        res.redirect("/account/settings/");
    }
};

exports.repos = function(req, res) {
    if(req.session.user.github) {
        async.series({
            repos: function(callback) {
                github_lib.repos(req.session.user.github, callback);
            },
        }, function(error, results) {
            if(!error) {
                res.json(results.repos);
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
        async.series({
            contents: function(callback) {
                github_lib.contents(
                    req.session.user.github,
                    req.session.user.code_locations[req.param("0")].github_repository,
                    req.param("1"), callback
                );
            },
        }, function(error, results){
            if(!error) {
                if("name" in results.contents) {
                    var extension = results.contents.name.split(".")[1];
                    if(["png", "gif", "jpg", "jpeg", "ico", "wbm"].indexOf(extension) > -1) {
                        res.writeHead(200, {
                            "Content-Type": "image/" + extension,
                            "Content-disposition": "attachment; filename=" + results.contents.name
                        });
                        res.end(results.contents.file, "binary");
                    } else {
                        res.json(results.contents);
                    }
                } else {
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
