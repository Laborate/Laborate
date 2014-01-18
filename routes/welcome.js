var pages = ["index", "creative", "social", "explore"];

exports.index = function(req, res) {
    res.renderOutdated('welcome/index', {
        title: 'Welcome',
        js: clientJS.renderTags("backdrop", "welcome"),
        css: clientCSS.renderTags("backdrop", "welcome"),
        backdrop: req.backdrop(),
        pageTrack: true
    });
};


exports.creative = function(req, res) {
    res.renderOutdated('welcome/creative', {
        title: 'Welcome',
        user: req.session.user,
        js: clientJS.renderTags("backdrop", "welcome", "codemirror"),
        css: clientCSS.renderTags("backdrop", "welcome", "codemirror"),
        backdrop: req.backdrop(),
        pageTrack: true
    });
};

exports.social = function(req, res) {
    req.models.users.all(10, function(error, users) {
        if(!error) {
            res.renderOutdated('welcome/social', {
                title: 'Welcome',
                users: users,
                js: clientJS.renderTags("backdrop", "welcome"),
                css: clientCSS.renderTags("backdrop", "welcome"),
                backdrop: req.backdrop(),
                pageTrack: true
            });
        } else {
            res.error(404, null, error);
        }
    });
};

exports.laborator = function(req, res) {
    res.renderOutdated('welcome/laborator', {
        title: 'Welcome',
        user: req.session.user,
        js: clientJS.renderTags("backdrop", "welcome"),
        css: clientCSS.renderTags("backdrop", "welcome"),
        backdrop: req.backdrop(),
        pageTrack: true
    });
};
