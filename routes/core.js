/* Modules: Custom */
var email = require('../lib/email');

exports.login = function(req, res) {
    var data = {
        title: 'Login',
        mode: "login",
        js: clientJS.renderTags("backdrop"),
        css: clientCSS.renderTags("backdrop")
    }
    res.render('login', data);
};

exports.register = function(req, res) {
    var data = {
        title: 'Register',
        mode: 'register',
        js: clientJS.renderTags("backdrop"),
        css: clientCSS.renderTags("backdrop")
    }
    res.render('register', data);
};

exports.verify = function(req, res) {
    if(req.session.user.verified) {
        var data = {
            title: 'Verify Your Account',
            mode: "verify",
            feedback: 'Verification Email Has Been Sent',
            js: clientJS.renderTags("backdrop"),
            css: clientCSS.renderTags("backdrop")
        }
        res.render('verify', data);
    } else {
        res.redirect("/documents/");
    }
};

exports.verify_resend = function(req, res) {
    if(req.session.user.verified) {
        var data = {
            title: 'Resent Verification Email',
            mode: "verify",
            feedback: 'Resent Verification Email',
            js: clientJS.renderTags("backdrop"),
            css: clientCSS.renderTags("backdrop")
        }
        res.render('verify', data);

        email("verify", {
            host: req.host,
            from: "support@laborate.io",
            subject: "Please Verify Your Email",
            users: [{
                name: req.session.user.name,
                email: req.session.user.email,
                code: req.session.user.verified
            }]
        });
    } else {
        res.redirect("/documents/");
    }
};

exports.not_found = function(req, res, next) {
    require("./error").handler({status: 404}, req, res, next);
};
