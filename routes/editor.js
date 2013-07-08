/* Modules: NPM */
var $ = require("jquery");

/* Modules: Custom */
var email = require('../lib/email');
var error_lib = require('./error');

exports.index = function(req, res, next) {
    if(req.param("document")) {
        req.models.documents.get(req.param("document"), function(error, document) {
            if(document) {
                if(document.password == null) {
                    var js = clientJS.renderTags("backdrop", "codemirror", "editor", "header", "jscroll", "editor-auto-join");
                } else {
                    var js = clientJS.renderTags("backdrop", "codemirror", "editor", "header", "jscroll")
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
                error_lib.handler({status: 404}, req, res, next);
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
                res.json({
                    success: false,
                    error_message: "Incorrect Password"
                 });
            }
        } else {
            res.json({
                success: false,
                error_message: "Failed To Join File"
            });
        }
    });
}

exports.update = function(req, res, next) {
    req.models.documents_roles.find({
        user_id: req.session.user.id,
        document_id: req.param("document")
    }, function(error, documents) {
        if(!error && documents.length == 1) {
            var document = documents[0].document;
            document.name = req.param("name");

            if(document.owner = req.session.user.id && req.param("password")) {
                document.password = document.hash(req.param("password"));
            } else {
                document.password = null;
            }

            res.json({ success: true });
        } else {
            res.json({
                success: false,
                error_message: "Failed To Update File"
            });
        }
    });
}

exports.download = function(req, res, next) {
    req.models.documents_roles.find({
        user_id: req.session.user.id,
        document_id: req.param("document")
    }, function(error, documents) {
        if(!error && documents.length == 1) {
            var document = documents[0].document;
            res.attachment(document.name);
            res.end(document.content.join("\n"));
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

exports.invite = function(req, res) {
    req.models.documents_roles.find({
        user_id: req.session.user.id,
        document_id: req.param("document")
    }, function(error, documents) {
        if(!error) {
            var document = documents[0].document;
            email("document_invite", {
                host: req.host,
                from: req.session.user.name + " <" + req.session.user.email + ">",
                subject: document.name,
                users: $.map(req.param("addresses").split(","), function(address) {
                    return {
                        email: $.trim(address),
                        role: documents[0],
                        collaborators: $.map(document.roles, function(role) {
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
