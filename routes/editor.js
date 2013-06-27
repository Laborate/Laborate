exports.index = function(req, res) {
    req.models.documents_roles.find({document_id: req.param("0"), user_id: req.session.user.id}, function(error, documents) {
        if(documents.length > 0) {
            var data = {
                title: documents[0].document.name,
                navigation: documents[0].document.name,
                mode: "editor",
                content: (documents[0].document.content) ? documents[0].document.content.join("\n") : '',
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
