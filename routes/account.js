/* Modules: NPM */
var async = require("async");

/* Modules: Custom */
var github_lib = require("../lib/github");

exports.index = function(req, res) {
    res.render('account', {
        title: 'Account',
        navigation: 'User Settings',
        mode: "account",
        user: req.session.user,
        github_auth_url: github_lib.auth_url,
        js: clientJS.renderTags("account", "header"),
        css: clientCSS.renderTags("account", "header"),
    });
};
