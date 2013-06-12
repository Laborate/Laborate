exports.login = function(req, res) {
    var data = {
        title: 'Login',
        mode: 'Login',
        js: clientJS.renderTags("backdrop"),
        css: clientCSS.renderTags("backdrop")
    }
    res.render('login', data);
};

exports.register = function(req, res) {
    var data = {
        title: 'Register',
        mode: 'Register',
        js: clientJS.renderTags("backdrop"),
        css: clientCSS.renderTags("backdrop")
    }
    res.render('register', data);
};

exports.activate = function(req, res) {
    if(req.session.user.activated) {
        var data = {
            title: 'Activate Your Account',
            mode: 'Activate',
            js: clientJS.renderTags("backdrop"),
            css: clientCSS.renderTags("backdrop")
        }
        res.render('activate', data);
    } else {
        res.redirect("/documents/");
    }
};

// TODO: Send Email
exports.activate_resend = function(req, res) {
    if(req.session.user.activated) {
        var data = {
            title: 'Activate Your Account',
            mode: 'Activate',
            js: clientJS.renderTags("backdrop"),
            css: clientCSS.renderTags("backdrop")
        }
        res.render('activate', data);
    } else {
        res.redirect("/documents/");
    }
};

exports.not_found = function(req, res, next) {
    require("./error").handler({status: 404}, req, res, next);
};
