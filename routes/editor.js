var $ = require("jquery");

exports.index = function(req, res) {
    req.models.documents.get(req.param("0"), function(error, document) {
        if(document) {
            var data = {
                title: document.name,
                navigation: document.name,
                mode: "editor",
                user: req.session.user,
                document: document,
                js: clientJS.renderTags("editor", "header", "codemirror", "jscroll"),
                css: clientCSS.renderTags("editor", "header", "codemirror", "jscroll")
            }
            res.render('editor', data);
        } else {
            if(!req.param("0")) {
                var data = {
                    title: 'Editor',
                    navigation: '',
                    mode: "editor",
                    content: '',
                    document: null,
                    js: clientJS.renderTags("editor", "header", "codemirror", "jscroll"),
                    css: clientCSS.renderTags("editor", "header", "codemirror", "jscroll")
                }
                res.render('editor', data);
            } else {
                res.redirect('/editor/');
            }
        }
    });
};
