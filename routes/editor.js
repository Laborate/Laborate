exports.index = function(req, res, next) {
    if(req.param("document")) {
        req.models.documents.roles.find({
            document_pub_id: req.param("document")
        }, function(error, documents) {
            if(!error) {
                if(documents.length != 0) {
                    document = documents[0].document;
                    password = (document.password == null);

                    res.renderOutdated('editor/index', {
                        title: document.name,
                        navigation: document.name,
                        mode: "editor",
                        user: req.session.user,
                        document: document,
                        js: clientJS.renderTags("backdrop", "codemirror", "editor", "aysnc", "copy",
                                                "download", "jscroll"),
                        css: clientCSS.renderTags("backdrop", "codemirror", "editor", "header", "jscroll"),
                        backdrop: req.backdrop("blurry"),
                        private: !password,
                        config: { autoJoin: password }
                    });
                } else {
                   res.error(404);
                }
            } else {
                res.error(404, false, true, error);
            }
        });
    } else {
       res.renderOutdated('editor/join', {
            title: "Join A Document",
            mode: "editor-join",
            js: clientJS.renderTags("backdrop"),
            css: clientCSS.renderTags("backdrop"),
            backdrop: req.backdrop("blurry")
        });
    }
};

exports.exists = function(req, res, next) {
    req.models.documents.exists({
        pub_id: req.param("document")
    }, function(error, exists) {
        if(!error && exists) {
            res.json({
                success: true,
                next: {
                    function: "window.backdrop.urlChange",
                    arguments: "/editor/" + req.param("document") + "/"
                }
            });
        } else {
            res.error(200, "Document Doesn't Exist", true, error);
        }
    });
}

exports.join = function(req, res, next) {
    req.models.documents.find({
        pub_id: req.param("document")
    }, function(error, documents) {
        if(!error && documents.length != 0) {
            document = documents[0];
            if(!document.password || document.hash(req.param("password")) == document.password) {
                document.join(req.session.user.id, 2);
                res.json({
                    success: true,
                    next: {
                        function: "window.editorUtil.join",
                        arguments: document.password
                    }
                });
            } else {
                res.error(200, "Incorrect Password");
            }
        } else {
            res.error(404, false, true, error);
        }
    });
}

exports.update = function(req, res, next) {
    req.models.documents.roles.find({
        user_id: req.session.user.id,
        document_pub_id: req.param("document")
    }, function(error, documents) {
        if(documents.length == 1) {
            if(!error) {
                var document = documents[0].document;
                if(document.password == req.access_token) {
                    document.name = req.param("name");

                    if(req.param("change_password") == "true") {
                        if(document.owner.id == req.session.user.id) {
                            if(req.param("password")) {
                                document.password = document.hash(req.param("password"));
                            } else {
                                document.password = null;
                            }

                            document.save();

                            res.json({
                                success: true,
                                hash: document.password
                            });
                        } else {
                            res.error(200, "Failed To Update File");
                        }
                    } else {
                        res.json({ success: true });
                        document.save();
                    }
                } else {
                    res.error(200, "Failed To Update File");
                }
            } else {
                res.error(200, "Failed To Update File", true, error);
            }
        } else {
            res.error(404);
        }
    });
}

exports.download = function(req, res, next) {
    req.models.documents.roles.find({
        user_id: req.session.user.id,
        document_pub_id: req.param("document")
    }, function(error, documents) {
        if(!error) {
            if(documents.length == 1) {
                var document = documents[0].document;
                if(document.password == req.access_token) {
                    res.cookie("fileDownload", true, {path: "/"});
                    res.attachment(document.name);
                    res.end((document.content) ? document.content.join("\n") : "", "UTF-8");
                } else {
                    res.error(404);
                }
            } else {
                res.error(404);
            }
        } else {
            res.error(400, "Failed To Download File", true, error);
        }
    });
}

exports.remove = function(req, res, next) {
    req.models.documents.roles.find({
        user_id: req.session.user.id,
        document_pub_id: req.param("document")
    }, function(error, documents) {
        if(!error && documents.length == 1) {
            var document = documents[0].document;
            if(document.password == req.access_token) {
                if(document.owner_id == req.session.user.id) {
                    document.remove(function(error) {
                        if(!error) {
                            res.json({ success: true, master: true });
                        } else {
                            res.error(200, "Failed To Remove File", true, error);
                        }
                    });
                } else {
                    req.models.documents.roles.find({
                        user_id: req.session.user.id,
                        document_id: req.param("document")
                    }).remove(function(error) {
                        if(!error) {
                            res.json({ success: true, master: false });
                        } else {
                            res.error(200, "Failed To Remove File", true, error);
                        }
                    });
                }
            } else {
                res.error(404);
            }
        } else {
            res.error(400, false, true, error);
        }
    });
}

exports.invite = function(req, res, next) {
    req.models.documents.roles.find({
        user_id: req.session.user.id,
        document_pub_id: req.param("document")
    }, function(error, documents) {
        if(!error) {
            if(documents.length == 1) {
                var document = documents[0].document;
                if(document.password == req.access_token) {
                    req.email("document_invite", {
                        from: req.session.user.name + " <" + req.session.user.email + ">",
                        subject: document.name,
                        users: $.map(req.param("addresses").split(","), function(address) {
                            return {
                                email: $.trim(address),
                                id: document.pub_id,
                                name: document.name,
                                access: (document.password) ? "Password" : "Open",
                                collaborators: $.map(document.roles, function(role) {
                                    if(role.user) {
                                        return (req.session.user.id != role.user.id) ? role.user.screen_name : null;
                                    } else {
                                        return null;
                                    }
                                }).join(", "),
                                message: req.param("message")
                            }
                        })
                    }, function(errors) {
                        if(errors.length == 0) {
                            res.json({ success: true });
                        } else {
                            res.error(200, "Failed To Send Invite", true, errors);
                        }
                    });
                } else {
                    res.error(200, "Failed To Send Invite");
                }
            } else {
                res.error(404);
            }
        } else {
            res.error(200, "Failed To Send Invite", true, error);
        }
    });
}


exports.access_token = function(req, res, next) {
    req.access_token = (req.param("access_token")) ? req.param("access_token") : null;
    next();
}
