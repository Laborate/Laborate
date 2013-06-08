var error = require("./error");

exports.login = function(req, res) {
    var data = {
        title: 'Login',
        mode: 'Login',
        js: clientJS.renderTags("core", "backdrop", "backdrop_user"),
        css: clientCSS.renderTags("core", "backdrop")
    }
    res.render('login', data);
};

exports.register = function(req, res) {
    var data = {
        title: 'Register',
        mode: 'Register',
        js: clientJS.renderTags("core", "backdrop", "backdrop_user"),
        css: clientCSS.renderTags("core", "backdrop")
    }
    res.render('register', data);
};

exports.not_found = function(req, res, next) {
    error.handler({status: 404}, req, res, next);
};
