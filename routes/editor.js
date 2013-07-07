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

exports.update = function(req, res, next) {
    req.models.documents_roles.find({
        user_id: req.session.user.id,
        document_id: req.param("document")
    }, function(error, documents) {
        if(!error && documents.length == 1) {
            documents[0].document.name = req.param("name");

            if(documents[0].document.owner = req.session.user.id && req.param("password")) {
                documents[0].document.password = documents[0].document.hash(req.param("password"));
            } else {
                documents[0].document.password = null;
            }

            res.json({ success: true });
        } else {
            error_lib.handler({status: 404}, req, res, next);
        }
    });
}

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

exports.remove = function(req, res, next) {
    req.models.documents.get(req.param("document"), function(error, document) {
        if(!error) {
            if(document.owner_id == req.session.user.id) {
                document.remove(function(error) {
                    if(!error) {
                        res.json({ success: true });
                    } else {
                        res.json({
                            success: false,
                            error_message: "Failed To Remove File"
                        });
                    }
                });
            } else {
                req.models.documents_roles.find({
                    user_id: req.session.user.id,
                    document_id: req.param("0")
                }).remove(function(error) {
                    if(!error) {
                        res.json({ success: true });
                    } else {
                        res.json({
                            success: false,
                            error_message: "Failed To Remove File"
                        });
                    }
                });
            }
        } else {
            res.json({
                success: false,
                error_message: "Failed To Remove File"
            });
        }
    });
}

exports.invite_email = function(req, res) {
    req.models.documents_roles.find({
        user_id: req.session.user.id,
        document_id: req.param("document")
    }, function(error, documents) {
        if(!error) {
            console.log(documents[0].document)
            email("document_invite", {
                host: req.host,
                from: req.session.user.name + " <" + req.session.user.email + ">",
                subject: documents[0].document.name,
                users: $.map(req.param("addresses").split(","), function(address) {
                    return {
                        email: $.trim(address),
                        role: documents[0],
                        collaborators: $.map(documents[0].document.roles, function(role) {
                            return role.user.screen_name;
                        }).join(", "),
                        message: req.param("message")
                    }
                })
            }, function(errors) {
                if(errors.length == 0) {
                    res.json({ success: true });
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
