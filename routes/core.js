/* Modules */
var sequence = require("futures").sequence();
var mysql_lib = require("../lib/mysql_lib");
var load_dependencies = require("../lib/dependencies");

exports.login = function(req, res) {
    load_dependencies(req);

    var data = {
        host: req.host,
        title: 'Login',
        mode: 'Login',
        js: req.app.get("clientJS").renderTags("core", "backdrop"),
        css: req.app.get("clientCSS").renderTags("core", "backdrop")
    }

    res.render('login', data);
};

exports.register = function(req, res) {
    load_dependencies(req);

    var data = {
        host: req.host,
        title: 'Register',
        mode: 'Register',
        js: req.app.get("clientJS").renderTags("core", "backdrop"),
        css: req.app.get("clientCSS").renderTags("core", "backdrop")
    }

    res.render('register', data);
};

exports.account = function(req, res) {
    sequence
        .then(function(next) {
            load_dependencies(req);
            mysql_lib.pricing_by_id(next, req.session.user.pricing);
        })
        .then(function(next, pricing){
            var data = {
                host: req.host,
                title: 'Account',
                mode: 'User Settings',
                user: req.session.user,
                pricing: pricing[0],
                js: req.app.get("clientJS").renderTags("core", "account", "header"),
                css: req.app.get("clientCSS").renderTags("core", "account", "header", "icons"),
            }
            res.render('account', data);
            next();
        });
};

exports.documents = function(req, res) {
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