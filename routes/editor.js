exports.index = function(req, res) {
    var data = {
        title: 'Documents',
        mode: 'Documents Drive',
        user: req.session.user,
        js: clientJS.renderTags("documents", "header"),
        css: clientCSS.renderTags("documents", "header", "icons")
    }
    res.render('documents', data);
};
