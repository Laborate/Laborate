exports.index = function(req, res) {
    req.models.documents.get(req.param("0"), function(error, document) {
        if(document) {
            console.log(document)
            var data = {
                title: document.name,
                navigation: document.name,
                mode: "editor",
                content: (document.content) ? document.content.join("\n") : '',
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
