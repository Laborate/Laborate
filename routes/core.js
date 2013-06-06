/* Modules: Custom */
var load_dependencies = require("../lib/core/dependencies");

exports.login = function(req, res) {
    load_dependencies(req);

    var data = {
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
        title: 'Register',
        mode: 'Register',
        js: req.app.get("clientJS").renderTags("core", "backdrop", "backdrop_user"),
        css: req.app.get("clientCSS").renderTags("core", "backdrop")
    }

    res.render('register', data);
};

exports.not_found = function(req, res, next) {
    exports.error_handling({status: 404}, req, res, next);
};


exports.error_handling = function(error, req, res, next) {
    if(error.status) {
        var error_message;
        var error_html;
        var redirect_url;

        switch(error.status) {
            case 401:
                error_message = "Login Required";
                redirect_url = "/logout/";
                break;
            case 403:
                error_message = "Access Forbidden";
                error_html = 'You are not authorized to view this page.<br/>Please continue back <a href="/">home</a>.';
                break;
            default:
                error_message = "Page Not Found";
                error_html = 'Sorry, this page is not available.<br/>Please continue back <a href="/">home</a>.';
                break;
        }

        if(req.xhr) {
            res.json({
                success: false,
                error_message: error_message
            });
        } else {
            res.status(error.status)
            res.format({
                'text/plain': function(){
                    res.send(error_message);
                },
                'text/html': function(){
                    if(redirect_url) {
                        res.redirect(redirect_url);
                    } else {
                        load_dependencies(req);

                        var data = {
                            host: req.host,
                            title: error_message,
                            mode: error_message,
                            js: req.app.get("clientJS").renderTags("core", "backdrop"),
                            css: req.app.get("clientCSS").renderTags("core", "backdrop"),
                            error_html: error_html
                        }

                        res.render('error', data);
                    }
                },
                'json': function(){
                    res.json({
                        success: false,
                        error_message: error_message
                    });
                },
                'application/json': function(){
                    res.json({
                        success: false,
                        error_message: error_message
                    });
                }
            });
        }
    } else {
        next();
    }
};
