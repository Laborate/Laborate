exports.index = function(req, res) {
    req.models.documents.get(req.param("0"), function(error, document) {
        var data = {
            title: (document) ? document.name  : 'Editor',
            navigation: (document) ? document.name  : '',
            mode: "editor",
            content: (document.content) ? document.content.join("\n") : "",
            js: clientJS.renderTags("editor", "header", "codemirror", "jscroll"),
            css: clientCSS.renderTags("editor", "header", "codemirror", "jscroll")
        }
        res.render('editor', data);
    });
};
