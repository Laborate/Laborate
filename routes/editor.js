/* Modules: NPM */
var async = require("async");

/* Modules: Custom */
var mysql_lib = require("../lib/mysql/users");
var github_lib = require("../lib/github");

exports.index = function(req, res) {
    var data = {
        title: 'Documents',
        mode: 'Documents Drive',
        user: req.session.user,
        js: clientJS.renderTags("documents", "header"),
        css: clientCSS.renderTags("documents", "header", "icons")
    }
    res.render('documents', data);
};
