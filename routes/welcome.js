var pages = ["index", "creative", "social", "explore"];

exports.index = function(req, res) {
    var page = req.param("page") || "index";

    if(pages.indexOf(page) != -1) {
        if(page == "creative") {
            var js = clientJS.renderTags("backdrop", "welcome", "codemirror");
            var css = clientCSS.renderTags("backdrop", "welcome", "codemirror");
        } else {
            var js = clientJS.renderTags("backdrop", "welcome");
            var css = clientCSS.renderTags("backdrop", "welcome");
        }

        res.renderOutdated('welcome/' + page, {
            title: 'Welcome',
            user: req.session.user,
            js: js,
            css: css,
            backdrop: req.backdrop(),
            pageTrack: true
        });
    } else {
        res.error(404);
    }
};

exports.skip = function(req, res) {

}

exports.finish = function(req, res) {

}
