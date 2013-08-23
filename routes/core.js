var outdatedhtml = require('express-outdatedhtml');

exports.config = function(req, res, next) {
    //Header Config
    res.setHeader("Server", "Laborate.io");

    //Response Locals
    res.locals.csrf = req.session._csrf;
    res.locals.port = config.general.port;
    res.locals.environment = config.general.environment;
    res.locals.host = req.host;
    res.locals.site_title = config.general.product + config.general.delimeter.web + config.general.company;
    res.locals.site_delimeter = config.general.delimeter.web;
    res.locals.sentry = config.sentry.browser;

    //Replace Views Elements For Compatibility With IE
    res.renderOutdated = function(view, data) {
        res.render(view, data, outdatedhtml.makeoutdated(req, res));
    }

    next();
}


exports.login = function(req, res) {
    res.renderOutdated('login', {
        title: 'Login',
        mode: "login",
        js: clientJS.renderTags("backdrop"),
        css: clientCSS.renderTags("backdrop")
    });
};

exports.register = function(req, res) {
    res.renderOutdated('register', {
        title: 'Register',
        mode: 'register',
        js: clientJS.renderTags("backdrop"),
        css: clientCSS.renderTags("backdrop")
    });
};

exports.verify = function(req, res) {
    if(req.session.user.verified) {
        res.renderOutdated('verify', {
            title: 'Verify Your Account',
            mode: "verify",
            feedback: 'Verification Email Has Been Sent',
            js: clientJS.renderTags("backdrop"),
            css: clientCSS.renderTags("backdrop")
        });
    } else {
        res.redirect("/documents/");
    }
};
