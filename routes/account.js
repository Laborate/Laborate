/* Modules: NPM */
var async = require("async");

/* Modules: Custom */
var github_lib = require("../lib/github");

exports.index = function(req, res) {
    req.models.documents.count({
        owner_id: req.session.user.id,
        password: req.db.tools.ne(null)
    }, function(error, count) {
        var data = {
            title: 'Account',
            mode: 'User Settings',
            user: req.session.user,
            github_auth_url: github_lib.auth_url,
            pass_sessions_count: count,
            js: clientJS.renderTags("account", "header"),
            css: clientCSS.renderTags("account", "header", "icons"),
        }
        res.render('account', data);
    });
};
