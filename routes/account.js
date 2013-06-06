/* Modules: NPM */
var async = require("async");

/* Modules: Custom */
var user_mysql = require("../lib/mysql/users");
var github_lib = require("../lib/github");

exports.index = function(req, res) {
    async.parallel({
        pass_sessions_count: function(callback) {
            user_mysql.user_pass_documents_count(callback, req.session.user.id);
        }
    }, function(error, results){
        var data = {
            title: 'Account',
            mode: 'User Settings',
            user: req.session.user,
            github_auth_url: github_lib.auth_url,
            pass_sessions_count: results.pass_sessions_count,
            js: clientJS.renderTags("core", "account", "header"),
            css: clientCSS.renderTags("core", "account", "header", "icons"),
        }
        res.render('account', data);
    });
};
