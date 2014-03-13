var error_handler = function(status, message, locals, req, res) {
    var error_message;
    var error_html;
    var redirect_url;

    locals = locals || {};
    locals.home = locals.home || true;
    locals.embed = locals.embed || false;

    switch(status) {
        case 401:
            error_message = "Login Required";
            redirect_url = "/logout/";
            req.session.redirect_url = req.originalUrl;
            req.session.save();
            break;
        case 402:
            error_message = "Login Required";
            redirect_url = "/logout/";
            break;
        case 403:
            error_message = "Access Forbidden";
            error_html = 'Access Forbidden';
            delete req.session._csrf;
            req.session.save();
            break;
        case 500:
            error_message = "Internal Server Error";
            error_html = 'Sorry we are having<br>technical difficulties';
            break;
        default:
            error_message = (message) ? message : "Page Not Found";
            error_html = (message) ? message : 'Sorry, this page is not available';
            break;
    }

    if(error_html) {
        if((locals.home && !locals.embed) || error_html.split(". ").length > 1) {
            error_html = (error_html.slice(-1) == ".") ? error_html : error_html + ".";
        } else {
            error_html = (error_html.slice(-1) == ".") ? error_html.slice(0, -1) : error_html;
        }
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
                    res.renderOutdated('error/index', $.extend(true, {
                        host: req.host,
                        title: error_message,
                        mode: error_message,
                        js: clientJS.renderTags("backdrop"),
                        css: clientCSS.renderTags("backdrop"),
                        error_html: error_html,
                        backdrop: req.backdrop(),
                        header_class: "lighten",
                        pageTrack: false,
                        mobile: false,
                        home: locals.home,
                        embed: locals.embed
                    }, locals));
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
    res.error = function(status, message, error, locals) {
        error_handler(status, message, locals, req, res);
        req.error.capture(error);
    }
    next();
};
