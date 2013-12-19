exports.index = function(req, res, next) {
    if(req.param("document")) {
        req.models.documents.roles.find({
            document_pub_id: req.param("document"),
            access: true
        }, function(error, documents) {
            if(!error) {
                if(documents.length != 0) {
                    var document = documents[0].document;
                    var password = (document.password == null);

                    res.renderOutdated('editor/index', {
                        title: document.name,
                        user: req.session.user,
                        document: document,
                        js: clientJS.renderTags("backdrop", "codemirror", "editor", "aysnc", "copy", "download"),
                        css: clientCSS.renderTags("backdrop", "codemirror", "editor"),
                        backdrop: req.backdrop(),
                        private: !password,
                        config: { autoJoin: password }
                    });
                } else {
                   res.error(404);
                }
            } else {
                res.error(404, false, error);
            }
        });
    } else {
       res.renderOutdated('editor/join', {
            title: "Join A Document",
            js: clientJS.renderTags("backdrop"),
            css: clientCSS.renderTags("backdrop"),
            backdrop: req.backdrop()
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
            res.error(200, "Document Doesn't Exist", error);
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
                document.join(req.session.user.id, 2, function(access) {
                    if(access) {
                        res.json({
                            success: true,
                            next: {
                                function: "window.editorUtil.join",
                                arguments: document.password
                            }
                        });
                    } else {
                        res.error("Document Doesn't Exist");
                    }
                });
            } else {
                res.error(200, "Incorrect Password");
            }
        } else {
            res.error(404, "Document Doesn't Exist", error);
        }
    });
}

exports.update = function(req, res, next) {
    req.models.documents.roles.find({
        access: true,
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
                res.error(200, "Failed To Update File", error);
            }
        } else {
            res.error(404);
        }
    });
}

exports.download = function(req, res, next) {
    req.models.documents.roles.find({
        access: true,
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
            res.error(400, "Failed To Download File", error);
        }
    });
}

exports.remove = function(req, res, next) {
    req.models.documents.roles.find({
        access: true,
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
                            res.error(200, "Failed To Remove File", error);
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
                            res.error(200, "Failed To Remove File", error);
                        }
                    });
                }
            } else {
                res.error(404);
            }
        } else {
            res.error(400, false, error);
        }
    });
}

exports.invite = function(req, res, next) {
    req.models.documents.roles.find({
        access: true,
        user_id: req.session.user.id,
        document_pub_id: req.param("document")
    }, function(error, documents) {
        if(!error) {
            if(documents.length == 1) {
                var document = documents[0].document;
                if(document.password == req.access_token) {
                    req.models.users.find({
                        screen_name: req.param("screen_name")
                    }, function(error, users) {
                        if(!error && users.length == 1) {
                            var user = users[0];
                            document.invite(user.id, 2, function(success, reason) {
                                if(success) {
                                    req.email("document_invite", {
                                        from: req.session.user.name + " <" + req.session.user.email + ">",
                                        subject: document.name + " (" + req.session.user.screen_name + ")",
                                        users: [{
                                            email: user.email,
                                            name: user.name,
                                            document: {
                                                from: req.session.user.screen_name,
                                                name: document.name,
                                                id: document.pub_id,
                                                access: "editor",
                                                laborators: $.map(document.roles, function(role) {
                                                    if(role.user) {
                                                        if(req.session.user.id != role.user.id) {
                                                            return {
                                                                name: role.user.screen_name,
                                                                gravatar: role.user.gravatar
                                                            }
                                                        } else {
                                                            return null;
                                                        }
                                                    } else {
                                                        return null;
                                                    }
                                                })

                                            }
                                        }]
                                    }, req.error.capture);

                                    res.json({ success: true });
                                } else {
                                    res.error(200, reason || "Failed To Send Invite");
                                }
                            });
                        } else {
                            res.error(200, "User Doesn't Exist");
                        }
                    });
                } else {
                    res.error(200, "Failed To Send Invite");
                }
            } else {
                res.error(404);
            }
        } else {
            res.error(200, "Failed To Send Invite", error);
        }
    });
}

exports.laborators = function(req, res, next) {
    req.models.documents.roles.find({
        access: true,
        user_id: req.session.user.id,
        document_pub_id: req.param("document")
    }, function(error, roles) {
        if(!error) {
            res.json({
                success: true,
                laborators: $.map(roles, function(role) {
                    return {
                        id: role.user.pud_id,
                        screen_name: role.user.screen_name,
                        gravatar: role.user.gravatar,
                        permission: {
                            id: role.permission.id,
                            name: role.permission.name,
                            owner: role.permission.owner,
                            access: role.permission.access,
                            readonly: role.permission.readonly
                        }
                    }
                }).sort(function (a, b) {
                    if(a.permission.id == b.permission.id) {
                        a = a.screen_name;
                        b = b.screen_name;
                    } else {
                        a = a.permission.id;
                        b = b.permission.id;
                    }

                    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
                })
            });
        } else {
            res.error(200, "Failed To Get Laborators", error);
        }
    });
}


exports.access_token = function(req, res, next) {
    req.access_token = req.param("access_token") || null;
    next();
}
