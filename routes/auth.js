var core = require("./core");

exports.login = function(req, res) {
    res.renderOutdated('auth/login', {
        title: 'Login',
        mode: "login",
        js: clientJS.renderTags("backdrop"),
        css: clientCSS.renderTags("backdrop"),
        backdrop_img: core.backdrop_image("space")
    });
};

exports.register = function(req, res) {
    res.renderOutdated('auth/register', {
        title: 'Register',
        mode: 'register',
        js: clientJS.renderTags("backdrop"),
        css: clientCSS.renderTags("backdrop"),
        backdrop_img: core.backdrop_image("space")
    });
};

exports.verify = function(req, res) {
    if(req.session.user.verified) {
        res.renderOutdated('auth/verify', {
            title: 'Verify Your Account',
            mode: "verify",
            feedback: 'Verification Email Has Been Sent',
            js: clientJS.renderTags("backdrop"),
            css: clientCSS.renderTags("backdrop"),
            backdrop_img: core.backdrop_image("space")
        });
    } else {
        res.redirect("/documents/");
    }
};
