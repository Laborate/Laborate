/* Modules: NPM */
var async = require("async");

/* Modules: Custom */
var user_mysql = require("../lib/mysql/users");
var github_lib = require("../lib/github");
var load_dependencies = require("../lib/core/dependencies");

exports.index = function(req, res) {
    async.parallel({
        pass_sessions_count: function(callback) {
            user_mysql.user_pass_sessions_count(callback, req.session.user.id);
        }
    }, function(error, results){
        load_dependencies(req);

        var data = {
            host: req.host,
            title: 'Account',
            mode: 'User Settings',
            user: req.session.user,
            github_auth_url: github_lib.auth_url,
            pass_sessions_count: results.pass_sessions_count,
            js: req.app.get("clientJS").renderTags("core", "account", "header"),
            css: req.app.get("clientCSS").renderTags("core", "account", "header", "icons"),
        }
        res.render('account', data);
    });
};