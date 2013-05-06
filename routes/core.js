var load_dependencies = require("../lib/dependencies");

exports.login = function(req, res) {
    load_dependencies(req);

    var data = {
        host: req.host,
        title: 'Login',
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
        js: req.app.get("clientJS").renderTags("core", "backdrop"),
        css: req.app.get("clientCSS").renderTags("core", "backdrop")
    }

    res.render('register', data);
};

exports.documents = function(req, res) {
    load_dependencies(req);

    var data = {
        host: req.host,
        title: 'Documents',
        js: req.app.get("clientJS").renderTags("core", "documents", "header"),
        css: req.app.get("clientCSS").renderTags("core", "documents", "header", "icons")
    }

    res.render('documents', data);
};