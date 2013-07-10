/* Modules: Custom */
var email = require('../lib/email');

exports.login = function(req, res) {
    res.render('login', {
        title: 'Login',
        mode: "login",
        js: clientJS.renderTags("backdrop"),
        css: clientCSS.renderTags("backdrop")
    });
};

exports.register = function(req, res) {
    res.render('register', {
        title: 'Register',
        mode: 'register',
        js: clientJS.renderTags("backdrop"),
        css: clientCSS.renderTags("backdrop")
    });
};

exports.verify = function(req, res) {
    if(req.session.user.verified) {
        res.render('verify', {
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

exports.not_found = function(req, res, next) {
    require("./error").handler({status: 404}, req, res, next);
};
