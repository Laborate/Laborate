var error_handler = function(status, message, req, res) {
    var error_message;
    var error_html;
    var redirect_url;

    switch(status) {
        case 401:
            error_message = "Login Required";
            redirect_url = "/logout/";
            req.session.redirect_url = req.originalUrl;
            break;
        case 403:
            error_message = "Access Forbidden";
            error_html = 'You are not authorized to view this page.';
            delete req.session._csrf;
            break;
        default:
            error_message = "Page Not Found";
            error_html = 'Sorry, this page is not available.';
            break;
    }

    error_message = (message) ? message : error_message;
    error_html = (message) ? message : error_html;
    error_html = (error_html.slice(-1) == ".") ? error_html : error_html + ".";

    if(req.xhr) {
        res.json({
            success: false,
            error_message: error_message
        });
    } else {
        res.status(status)
        res.format({
            'text/plain': function(){
                res.send(error_message);
            },
            'text/html': function(){
                if(redirect_url) {
                    res.redirect(redirect_url);
                } else {
                    res.render('error', {
                        host: req.host,
                        title: error_message,
                        mode: error_message,
                        js: clientJS.renderTags("backdrop"),
                        css: clientCSS.renderTags("backdrop"),
                        error_html: error_html
                    });
                }
            },
            'application/json': function(){
                res.json({
                    success: false,
                    error_message: error_message
                });
            }
        });
    }
}

exports.global = function(error, req, res, next) {
    if(error.status) {
        error_handler(error.status, error.message, req, res);
    } else {
        next();
    }
};

exports.handler = function(req, res, next) {
    res.error = function(status, message) {
        error_handler(status, message, req, res);
    }
    next();
};
