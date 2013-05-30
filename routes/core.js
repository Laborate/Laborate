/* Modules: Custom */
var load_dependencies = require("../lib/core/dependencies");

exports.login = function(req, res) {
    load_dependencies(req);

    var data = {
        host: req.host,
        title: 'Login',
        mode: 'Login',
        js: req.app.get("clientJS").renderTags("core", "backdrop", "backdrop_user"),
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
        js: req.app.get("clientJS").renderTags("core", "backdrop", "backdrop_user"),
        css: req.app.get("clientCSS").renderTags("core", "backdrop")
    }

    res.render('register', data);
};

exports.not_found = function(req, res) {
    res.status(404);

    res.format({
        'text/plain': function(){
            res.send("404 - Page Not Found");
        },
        'text/html': function(){
            load_dependencies(req);

            var data = {
                host: req.host,
                title: 'Not Found',
                mode: 'Not Found',
                js: req.app.get("clientJS").renderTags("core", "backdrop"),
                css: req.app.get("clientCSS").renderTags("core", "backdrop")
            }

            res.render('not_found', data);
        },
        'json': function(){
            res.json({
                success: false,
                error_message: "404 - Page Not Found"
            });
        },
        'application/json': function(){
            res.json({
                success: false,
                error_message: "404 - Page Not Found"
            });
        }
    });
};