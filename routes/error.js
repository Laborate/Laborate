var error_handler = function(status, message, home, req, res) {
    var error_message;
    var error_html;
    var redirect_url;

    switch(status) {
        case 401:
            error_message = "Login Required";
            redirect_url = "/logout/";
            req.session.redirect_url = req.originalUrl;
            req.session.save();
            break;
        case 403:
            error_message = "Access Forbidden";
            error_html = 'Access Forbidden';
            delete req.session._csrf;
            req.session.save();
            break;
        case 500:
            error_message = "Internal Server Error";
            error_html = 'Sorry we are having technical difficulties. \
                         The problem has been reported and will be fixed soon.';
            break;
        default:
            error_message = (message) ? message : "Page Not Found";
            error_html = (message) ? message : 'Sorry, this page is not available.';
            break;
    }

    if(error_html) {
        error_html = (error_html.slice(-1) == ".") ? error_html : error_html + ".";
    }

    if(req.xhr) {
        res.json({
            success: false,
            error_message: error_message
        });
    } else {
        res.status(status);
        res.format({
            'text/plain': function() {
                res.send(error_message + "\n");
            },
            'text/html': function() {
                if(redirect_url) {
                    res.redirect(redirect_url);
                } else {
                    res.renderOutdated('error/index', {
                        host: req.host,
                        title: error_message,
                        mode: error_message,
                        js: clientJS.renderTags("backdrop"),
                        css: clientCSS.renderTags("backdrop"),
                        error_html: error_html,
                        home: home,
                        backdrop: req.backdrop(),
                        pageTrack: false,
                        mobile: false
                    });
                }
            },
            'application/json': function() {
                res.json({
                    success: false,
                    error_message: error_message
                });
            }
        });
    }
}

exports.global = function(error, req, res, next) {
    if(error) {
        var html = error
                    .toString()
                    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
                    .replace(/\n/g, '<br>');

        res.send(html);
        lib.error.capture(error);
    } else {
        next();
    }
};

exports.handler = function(req, res, next) {
    res.error = function(status, message, error, home) {
        error_handler(status, message, home, req, res);
        req.error.capture(error);
    }
    next();
};
