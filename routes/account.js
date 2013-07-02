/* Modules: NPM */
var async = require("async");

/* Modules: Custom */
var github_lib = require("../lib/github");

exports.index = function(req, res) {
    var data = {
        title: 'Account',
        navigation: 'User Settings',
        mode: "account",
        user: req.session.user,
        github_auth_url: github_lib.auth_url,
        js: clientJS.renderTags("account", "header"),
        css: clientCSS.renderTags("account", "header"),
    }
    res.render('account', data);
};
