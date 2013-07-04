var $ = require("jquery");
var email = require('../lib/email');

exports.index = function(req, res) {
    req.models.documents.get(req.param("id"), function(error, document) {
        if(document) {
            document.join(req.session.user.id, 2);
            res.render('editor', {
                title: document.name,
                navigation: document.name,
                mode: "editor",
                user: req.session.user,
                document: document,
                js: clientJS.renderTags("codemirror", "editor", "header", "jscroll"),
                css: clientCSS.renderTags("codemirror", "editor", "header", "jscroll")
            });
        } else {
            if(!req.param("id")) {
                res.render('editor', {
                    title: 'Editor',
                    navigation: '',
                    mode: "editor",
                    user: req.session.user,
                    document: null,
                    js: clientJS.renderTags("codemirror", "editor", "header", "jscroll"),
                    css: clientCSS.renderTags("codemirror", "editor", "header", "jscroll")
                });
            } else {
                res.redirect('/editor/');
            }
        }
    });
};

exports.invite_email = function(req, res) {
    req.models.documents.get(req.param("document"), function(error, document) {
        if(!error) {
            email("document_invite", {
                host: req.host,
                from: req.session.user.name + " <" + req.session.user.email + ">",
                subject: req.session.user.name + " Has Invited You To " + document.name,
                users: $.map(req.param("addresses").split(","), function(address) {
                    return {
                        email: $.trim(address),
                        document: {
                            id: document.id,
                            name: document.name
                        },
                        message: req.param("message")
                    }
                })
            }, function(errors) {
                if(errors.length == 0) {
                    res.json({
                        success: true
                    });
                } else {
                    res.json({
                        success: false,
                        error_message: "Failed To Send Email"
                    });
                }
            });
        } else {
            res.json({
                success: false,
                error_message: "Failed To Send Email"
            });
        }
    });
}
