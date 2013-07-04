/* Modules: NPM */
var $ = require("jquery");

/* Modules: Custom */
var email = require('../lib/email');
var error_lib = require('./error');

exports.index = function(req, res, next) {
    if(req.param("document")) {
        req.models.documents.get(req.param("document"), function(error, document) {
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
                error_lib.handler({status: 404}, req, res, next);
            }
        });
    } else {
       res.redirect('/documents/');
    }
};

exports.download = function(req, res, next) {
    req.models.documents_roles.find({
        user_id: req.session.user.id,
        document_id: req.param("document")
    }, function(error, documents) {
        if(!error && documents.length == 1) {
            res.attachment(documents[0].document.name);
            res.end(documents[0].document.content.join("\n"));
        } else {
            error_lib.handler({status: 404}, req, res, next);
        }
    });
}

exports.invite_email = function(req, res) {
    req.models.documents_roles.find({
        user_id: req.session.user.id,
        document_id: req.param("document")
    }, function(error, documents) {
        if(!error) {
            email("document_invite", {
                host: req.host,
                from: req.session.user.name + " <" + req.session.user.email + ">",
                subject: req.session.user.name + " Has Invited You To " + documents[0].document.name,
                users: $.map(req.param("addresses").split(","), function(address) {
                    return {
                        email: $.trim(address),
                        document: {
                            id: documents[0].document.id,
                            name: documents[0].document.name
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
