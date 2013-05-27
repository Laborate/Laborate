/* Modules: NPM */
var async = require("async");

/* Modules: Custom */
var mysql_lib = require("../lib/mysql/users");
var github_lib = require("../lib/github");
var load_dependencies = require("../lib/core/dependencies");

exports.index = function(req, res) {
    load_dependencies(req);

    var data = {
        host: req.host,
        title: 'Documents',
        mode: 'Documents Drive',
        user: req.session.user,
        js: req.app.get("clientJS").renderTags("core", "documents", "header"),
        css: req.app.get("clientCSS").renderTags("core", "documents", "header", "icons")
    }

    res.render('documents', data);
};