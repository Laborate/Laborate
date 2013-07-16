/* Modules: NPM */
var $ = require("jquery");

exports.index = function(req, res, next) {
    if(req.param("document")) {
        req.models.documents.get(req.param("document"), function(error, document) {
            if(document) {
                if(document.password == null) {
                    var js = clientJS.renderTags("backdrop", "codemirror", "editor",
                                                    "header", "jscroll", "editor-auto-join");
                } else {
                    var js = clientJS.renderTags("backdrop", "codemirror", "editor",
                                                    "header", "jscroll")
                }

                res.render('editor', {
                    title: document.name,
                    navigation: document.name,
                    mode: "editor",
                    user: req.session.user,
                    document: document,
                    js: js,
                    css: clientCSS.renderTags("backdrop", "codemirror", "editor", "header", "jscroll")
                });
            } else {
                res.error(404);
            }
        });
    } else {
       res.redirect('/documents/');
    }
};

exports.join = function(req, res, next) {
    req.models.documents.get(req.param("document"), function(error, document) {
        if(!error) {
            if(!document.password || document.hash(req.param("password")) == document.password) {
                document.join(req.session.user.id, 2);
                res.json({
                    success: true,
                    next: {
                        function: "window.editorUtil.join",
                        arguments: (document.content) ? document.content : []
                    }
                });
            } else {
                res.error(200, "Incorrect Password");
            }
        } else {
            res.error(404);
        }
    });
}

exports.update = function(req, res, next) {
    req.models.documents_roles.find({
        user_id: req.session.user.id,
        document_id: req.param("document")
    }, function(error, documents) {
        if(documents.length == 1) {
            if(!error) {
                var document = documents[0].document;
                document.name = req.param("name");

                if(req.param("change_password") == "true") {
                    if(document.owner.id == req.session.user.id) {
                        if(req.param("password")) {
                            document.password = document.hash(req.param("password"));
                        } else {
                            document.password = null;
                        }
                        res.json({ success: true });
                    } else {
                        res.error(200, "Failed To Update File");
                    }
                } else {
                    res.json({ success: true });
                }
            } else {
                res.error(200, "Failed To Update File");
            }
        } else {
            res.error(404);
        }
    });
}

exports.download = function(req, res, next) {
    req.models.documents_roles.find({
        user_id: req.session.user.id,
        document_id: req.param("document")
    }, function(error, documents) {
        if(documents.length == 1) {
            if(!error) {
                var document = documents[0].document;
                res.attachment(document.name);
                res.end(document.content.join("\n"));
            } else {
                res.error(200, "Failed To Download File");
            }
        } else {
            res.error(404);
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
                        res.error(200, "Failed To Remove File");
                    }
                });
            } else {
                req.models.documents_roles.find({
                    user_id: req.session.user.id,
                    document_id: req.param("document")
                }).remove(function(error) {
                    if(!error) {
                        res.json({ success: true });
                    } else {
                        res.error(200, "Failed To Remove File");
                    }
                });
            }
        } else {
            res.error(404);
        }
    });
}

exports.invite = function(req, res, next) {
    req.models.documents_roles.find({
        user_id: req.session.user.id,
        document_id: req.param("document")
    }, function(error, documents) {
        if(documents.length == 1) {
            if(!error) {
                var document = documents[0].document;
                req.email("document_invite", {
                    from: req.session.user.name + " <" + req.session.user.email + ">",
                    subject: document.name,
                    users: $.map(req.param("addresses").split(","), function(address) {
                        return {
                            email: $.trim(address),
                            role: documents[0],
                            collaborators: $.map(document.roles, function(role) {
                                return (req.session.user.id != role.user.id) ? role.user.screen_name : null;
                            }).join(", "),
                            message: req.param("message")
                        }
                    })
                }, function(errors) {
                    if(errors.length == 0) {
                        res.json({ success: true });
                    } else {
                        res.error(200, "Failed To Send Invite");
                    }
                });
            } else {
                res.error(200, "Failed To Send Invite");
            }
        } else {
            res.error(404);
        }
    });
}
