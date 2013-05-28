/* Modules: NPM */
var async = require("async");

/* Modules: Custom */
var auth = require("./auth");
var aes   = require('../lib/core/aes');
var user_mysql = require("../lib/mysql/users");
var github_lib = require("../lib/github");

exports.add_token = function(req, res) {
    if(req.param("code")) {
        async.series({
            add_token: function(callback) {
                github_lib.get_token(req.param("code"), function (error, token) {
                    token = aes.encrypt(token, req.session.user.email)
                    user_mysql.user_github_add_token(callback, req.session.user.id, token);
                });
            },
            reload_user: function(callback) {
                auth.reload_user(req, callback);
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
                user_mysql.user_github_remove_token(callback, req.session.user.id);
            },
            reload_user: function(callback) {
                auth.reload_user(req, callback);
            }
        }, function(error, results){
            res.redirect("/account/");
        });
    } else {
        res.json({});
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
        res.json({});
    }
};

exports.repo_contents = function(req, res) {
    if(req.session.user.github) {
        async.series({
            contents: function(callback) {
                github_lib.repo_contents(req.session.user.github, req.param("0"), req.param("1"), callback);
            },
        }, function(error, results){
            res.json(results.contents);
        });
    } else {
        res.json({});
    }
};