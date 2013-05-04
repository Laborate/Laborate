exports.index = function(req, res) {
    var data = {
        title: 'Express',
        js: req.app.get("clientJS").renderTags("core", "backdrop"),
        css: req.app.get("clientCSS").renderTags("core", "backdrop")
    }

    res.render('index', data);
};