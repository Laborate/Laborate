var github = require("./github");
var bitbucket = require("./github");

exports.index = function(req, res, next) {
    if(req.param("document")) {
        req.models.documents.find({
            pub_id: req.param("document")
        }, function(error, documents) {
            if(!error) {
                if(documents.length != 0) {
                    var document = documents[0];
                    var passed = false;

                    $.each(document.roles, function(key, role) {
                        if(role.access && role.user.id == req.session.user.id) {
                            passed = true;
                        }

                        if(document.roles.end(key)) {
                            if(passed || !document.private) {
                                req.models.documents.permissions.all(function(error, permissions) {
                                    if(!error) {
                                        res.renderOutdated('editor/index', {
                                            title: document.name,
                                            user: req.session.user,
                                            document: document,
                                            permissions: permissions,
                                            js: clientJS.renderTags("backdrop", "codemirror", "editor", "aysnc", "copy", "download"),
                                            css: clientCSS.renderTags("backdrop", "codemirror", "editor", "contextmenu"),
                                            backdrop: req.backdrop(),
                                            private: document.private,
                                            config: {
                                                permissions: $.map(permissions, function(permission) {
                                                    return permission.name;
                                                })
                                            }
                                        });
                                    } else {
                                        res.error(404);
                                    }
                                });
                            } else {
                                res.error(404);
                            }
                        }
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
                document.join(req.session.user, 2, function(exists, blocked) {
                    if(exists) {
                        if(!blocked) {
                            res.json({
                                success: true,
                                next: {
                                    function: "window.editorUtil.join"
                                }
                            });
                        } else {
                            res.error(200, "You Do Not Have Access To This Document");
                        }
                    } else {
                        res.error(200, "Document Doesn't Exist");
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
                var user = req.session.user;
                var document = documents[0].document;

                document.name = req.param("name");

                if(documents[0].permission.owner) {
                    if(!user.organizations.empty) {
                        if(!user.organizations[0].permission.student) {
                            document.readonly = (req.param("readonly") === "true");
                        }
                    }

                    if(user.pricing.documents == null || user.documents.private < user.pricing.documents) {
                        document.private = (req.param("private") === "true");
                    }
                }

                document.save(function(error, document) {
                    if(!error) {
                        res.json({ success: true });
                    } else {
                        res.error(200, "Failed To Update File", error);
                    }
                });
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
                res.cookie("fileDownload", true, { path: "/" });
                res.attachment(document.name);
                res.end((document.content) ? document.content.join("\n") : "", "UTF-8");
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

            if(documents[0].permission.owner) {
                document.remove(function(error) {
                    if(!error) {
                        res.json({
                            success: true,
                            owner: true
                        });
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
                        res.json({
                            success: true,
                            master: false
                        });
                    } else {
                        res.error(200, "Failed To Remove File", error);
                    }
                });
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

                req.models.users.find({
                    screen_name: req.param("screen_name")
                }, function(error, users) {
                    if(!error && users.length == 1) {
                        var user = users[0];
                        document.invite(user, 2, function(success, reason) {
                            if(success) {
                                var laborators = [];
                                $.each(document.roles, function(key, role) {
                                    role.getUser(function(error, new_user) {
                                        if([user.id, document.owner_id].indexOf(new_user.id) == -1) {
                                            laborators.push({
                                                name: new_user.screen_name,
                                                gravatar: new_user.gravatar
                                            });
                                        }

                                        if(document.roles.end(key)) {
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
                                                        laborators: laborators
                                                    }
                                                }]
                                            }, req.error.capture);

                                            res.json({ success: true });
                                        }
                                    });
                                });
                            } else {
                                res.error(200, reason || "Failed To Send Invite");
                            }
                        });
                    } else {
                        res.error(200, "User Doesn't Exist");
                    }
                });
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
        document_pub_id: req.param("document")
    }, function(error, roles) {
        if(!error) {
            var data = {
                success: true
            }

            data.laborators = $.map(roles, function(role) {
                if(req.session.user.id != role.user.id) {
                    return {
                        id: role.user.pub_id,
                        screen_name: role.user.screen_name,
                        gravatar: role.user.gravatar,
                        permission: {
                            id: role.permission.id,
                            access: role.permission.access,
                            owner: role.permission.owner
                        }
                    }
                } else {
                    data.permission = {
                        id: role.permission.id,
                        access: role.permission.access,
                        owner: role.permission.owner
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
            });

            res.json(data);
        } else {
            res.error(200, "Failed To Get Laborators", error);
        }
    });
}

exports.laborator = function(req, res, next) {
    req.models.documents.roles.find({
        user_pub_id: req.param("user"),
        document_pub_id: req.param("document")
    }, function(error, roles) {
        if(!error && !roles.empty) {
            if(roles[0].document.owner_id == req.session.user.id) {
                req.models.documents.permissions.get(
                    req.param("permission"), function(error, permission) {
                        if(!error && permission) {
                            roles[0].setPermission(permission, function(error, role) {
                                if(!error) {
                                    res.json({ success: true });
                                } else {
                                    res.error(200, "Failed To Update Permission", error);
                                }
                            });
                        } else {
                            res.error(200, "Failed To Update Permission", error);
                        }
                    });
            } else {
                res.error(200, "Failed To Update Permission");
            }
        } else {
            res.error(200, "Failed To Update Permission", error);
        }
    });
}

/*
    TODO: Add Bitbucket When They
    Release an API for Committing
*/
exports.commit = function(req, res, next) {
    req.models.documents.roles.find({
        user_id: req.session.user.id,
        document_pub_id: req.param("document"),
        access: true
    }, function(error, roles) {
        if(!error && !roles.empty) {
            if(!roles[0].permission.readonly) {
                var document = roles[0].document;
                var location = req.session.user.locations[document.location];

                if(location) {
                    if(!document.content.empty) {
                        switch(location.type) {
                            case (!config.apps.github || "github"):
                                github.commit(req, res, location, document);
                                break;
                            /*
                            case (!config.apps.bitbucket || "bitbucket"):
                                bitbucket.contents(req, res, next);
                                break;
                            */
                            default:
                                res.error(200, "Failed To Commit");
                                break;
                        }
                    } else {
                        res.error(200, "Failed To Commit");
                    }
                } else {
                    res.error(200, "Failed To Commit");
                }
            } else {
                res.error(200, "Failed To Commit", error);
            }
        } else {
            res.error(200, "Failed To Commit", error);
        }
    });
}
