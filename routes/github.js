/* Modules: NPM */
var async = require("async");

/* Modules: Custom */
var aes   = require('../lib/core/aes');
var user_mysql = require("../lib/mysql/users");
var github_lib = require("../lib/github");

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
            res.redirect("/account/");
        });
    } else {
        res.redirect("/account/");
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
            res.redirect("/account/");
        });
    } else {
        res.redirect("/account/");
    }
};

exports.user_repos = function(req, res) {
    if(req.session.user.github) {
        async.series({
            repos: function(callback) {
                github_lib.user_repos(req.session.user.github, callback);
            },
        }, function(error, results){
            res.json(results.repos);
        });
    } else {
        res.json([]);
    }
};

exports.repo_contents = function(req, res) {
    if(req.session.user.github && req.session.user.locations) {
        async.series({
            contents: function(callback) {
                if(req.param("0") in req.session.user.locations) {
                    github_lib.repo_contents(
                        req.session.user.github,
                        req.session.user.locations[req.param("0")].github_repository,
                        req.param("1"), callback
                    );
                } else {
                    callback([]);
                }
            },
        }, function(error, results){
            res.json(results.contents);
        });
    } else {
        res.json([]);
    }
};