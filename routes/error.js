exports.handler = function(error, req, res, next) {
    if(error.status) {
        var error_message;
        var error_html;
        var redirect_url;

        switch(error.status) {
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

        error_message = (error.message) ? error.message : error_message;

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
    } else {
        next();
    }
};
