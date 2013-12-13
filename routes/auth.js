exports.login = function(req, res) {
    res.renderOutdated('auth/login', {
        title: 'Login',
        js: clientJS.renderTags("backdrop", "crypto"),
        css: clientCSS.renderTags("backdrop"),
        backdrop: req.backdrop(),
        pageTrack: false
    });
};

exports.register = function(req, res) {
    res.renderOutdated('auth/register', {
        title: 'Register',
        js: clientJS.renderTags("backdrop"),
        css: clientCSS.renderTags("backdrop"),
        backdrop: req.backdrop(),
        pageTrack: false
    });
};

exports.verify = function(req, res) {
    if(req.session.user.verify) {
        res.renderOutdated('auth/verify', {
            title: 'Verify Your Account',
            feedback: 'Verification Email Has Been Sent',
            js: clientJS.renderTags("backdrop"),
            css: clientCSS.renderTags("backdrop"),
            backdrop: req.backdrop(),
            pageTrack: false
        });
    } else {
        res.redirect("/documents/");
    }
};

exports.reset = function(req, res) {
    var view = 'auth/reset';
    view += (req.session.reset) ? "/message" : "/index";

    res.renderOutdated(view, {
        title: 'Reset Password',
        js: clientJS.renderTags("backdrop"),
        css: clientCSS.renderTags("backdrop"),
        backdrop: req.backdrop(),
        pageTrack: false
    });
};

exports.reset_password = function(req, res) {
    if(req.session.reset) {
        req.models.users.find({
            reset: req.param("code")
        }, function(error, users) {
            if(!error && users.length == 1) {
                res.renderOutdated('auth/reset/password', {
                    title: 'Reset Password',
                    code: req.param("code"),
                    js: clientJS.renderTags("backdrop"),
                    css: clientCSS.renderTags("backdrop"),
                    backdrop: req.backdrop(),
                    pageTrack: false
                });
            } else {
                res.redirect("/");
            }
        });
    } else {
        res.redirect("/");
    }
};
