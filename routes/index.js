exports.login = function(req, res) {
    console.log(req.session.id);
    var data = {
        host: req.host,
        title: 'Login',
        js: req.app.get("clientJS").renderTags("core", "backdrop"),
        css: req.app.get("clientCSS").renderTags("core", "backdrop")
    }

    res.render('login', data);
};

exports.register = function(req, res) {
    var data = {
        host: req.host,
        title: 'Register',
        js: req.app.get("clientJS").renderTags("core", "backdrop"),
        css: req.app.get("clientCSS").renderTags("core", "backdrop")
    }

    res.render('register', data);
};

exports.documents = function(req, res) {
    var data = {
        host: req.host,
        title: 'Documents',
        js: req.app.get("clientJS").renderTags("core", "documents"),
        css: req.app.get("clientCSS").renderTags("core", "documents")
    }

    res.render('documents', data);
};