exports.login = function(req, res) {
    res.renderOutdated('auth/login', {
        title: 'Login',
        mode: "login",
        js: clientJS.renderTags("backdrop", "crypto"),
        css: clientCSS.renderTags("backdrop"),
        backdrop: req.backdrop("blurry"),
        pageTrack: false
    });
};

exports.register = function(req, res) {
    res.renderOutdated('auth/register', {
        title: 'Register',
        mode: 'register',
        js: clientJS.renderTags("backdrop"),
        css: clientCSS.renderTags("backdrop"),
        backdrop: req.backdrop("blurry"),
        pageTrack: false
    });
};

exports.verify = function(req, res) {
    if(req.session.user.verify) {
        res.renderOutdated('auth/verify', {
            title: 'Verify Your Account',
            mode: "verify",
            feedback: 'Verification Email Has Been Sent',
            js: clientJS.renderTags("backdrop"),
            css: clientCSS.renderTags("backdrop"),
            backdrop: req.backdrop("blurry"),
            pageTrack: false
        });
    } else {
        res.redirect("/documents/");
    }
};
