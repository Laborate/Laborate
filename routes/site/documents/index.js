/* Modules: NPM */
var fs = require('fs');
var rand = require("generate-key");

exports.index = function(req, res, next) {
    res.renderOutdated('documents/index', {
        title: 'Documents',
        header: "documents",
        js: clientJS.renderTags("documents", "download"),
        css: clientCSS.renderTags("documents")
    });
};

/* Online Files */
exports.files = function(req, res, next) {
    req.models.documents.roles.find({
        user_id: req.session.user.id,
        access: true
    }, function(error, roles) {
        if(!error) {
            if(!roles.empty) {
                res.json($.map(roles, function(role) {
                    if(role && role.document) {
                        return {
                            id: role.document.pub_id,
                            name: role.document.name,
                            private: role.document.private,
                            location: role.document.location,
                            size: role.document.size(),
                            type: role.document.type(),
                            users: (role.document.roles.length - 1),
                            role: role.permission.name.toLowerCase()
                        }
                    }
                }));
            } else {
                res.json([]);
            }
        } else {
            res.error(200, "Failed To Load Files", error);
        }
    });
};

exports.file_create = function(req, res, next) {
    req.models.documents.create({
        name: req.param("name"),
        owner_id: req.session.user.id,
        location: req.param("location") || null,
        path: req.param("path")
    }, function(error, document) {
        if(!error && document) {
            res.json({
                success: true,
                documents: [{
                    id: document.pub_id,
                    name: document.name,
                    size: document.size(),
                    type: function(name) {
                        var extension = name.split(".")[name.split(".").length-1];

                        if(["png", "gif", "jpg", "jpeg", "ico", "wbm"].indexOf(extension) > -1) {
                            return "file-image";
                        } else if(["html", "jade", "ejs", "erb", "md"].indexOf(extension) > -1) {
                            return "file-template";
                        } else if(["zip", "tar", "bz", "bz2", "gzip", "gz"].indexOf(extension) > -1) {
                            return "file-zip";
                        } else {
                            return "file-script";
                        }
                    }(document.name),
                    role: "owner",
                    location: document.location,
                    private: document.private
                }]
            });
        } else {
            res.error(200, "Failed To Create Document", error);
        }
    });
};

exports.file_upload = function(req, res, next) {
    if(req.files) {
        // Make sure it is a list
        if(!(req.files.files instanceof Array)) {
            req.files.files = [req.files.files];
        }

        var file_length = req.files.files.length;
        var response = {
            success: true,
            documents: []
        };
        var timer = setInterval(function() {
            if(file_length == response.documents.length) {
                clearInterval(timer);
                res.json(response);
            }
        }, 50);

        $.each(req.files.files, function(i, file) {
            // Type Casting and 1mb limit
            if(!((file.type == "" || file.type.match(/(?:text|json|octet-stream)/)) && file.size < 1024 * 2000)) {
                file_length -= 1;
                return true;
            }

            req.models.documents.create({
                name: file.name,
                owner_id: req.session.user.id,
                content: fs.readFileSync(file.path, 'utf8').split("\n"),
                location: req.param("location") || null,
                path: req.param("path")
            }, function(error, document) {
                if(!error && document) {
                    fs.unlink(file.path);

                    response.documents.push({
                        id: document.pub_id,
                        name: document.name,
                        size: document.size(),
                        type: function(name) {
                            var extension = name.split(".")[name.split(".").length-1];

                            if(["png", "gif", "jpg", "jpeg", "ico", "wbm"].indexOf(extension) > -1) {
                                return "file-image";
                            } else if(["html", "jade", "ejs", "erb", "md"].indexOf(extension) > -1) {
                                return "file-template";
                            } else if(["zip", "tar", "bz", "bz2", "gzip", "gz"].indexOf(extension) > -1) {
                                return "file-zip";
                            } else {
                                return "file-script";
                            }
                        }(document.name),
                        role: "owner",
                        location: document.location,
                        private: document.private
                    });
                } else {
                    res.error(200, "Failed To Upload Files", error);
                }
            });
        });
    } else {
        res.error(200, "Failed To Upload Files");
    }
}

exports.file_rename = function(req, res, next) {
    req.models.documents.roles.one({
        user_id: req.session.user.id,
        document_pub_id: req.param("document"),
        access: true
    }, function(error, role) {
        if(!error && role) {
            document = role.document;
            document.save({
                name: req.param("name")
            });

            res.json({
                success: true,
                document: {
                    id: document.pub_id,
                    name: document.name,
                    type: document.type()
                }
             });
        } else {
            res.error(200, "Failed To Rename File", error);
        }
    });
};

exports.file_private = function(req, res, next) {
    req.models.documents.roles.one({
        user_id: req.session.user.id,
        document_pub_id: req.param("document"),
        access: true
    }, function(error, role) {
        if(!error && role) {
            var user = req.session.user;
            var document = role.document;

            if(document.owner_id == user.id) {
                document.private = (req.param("private") === "true");

                if(!document.private || (user.pricing.documents == null || user.documents.private < user.pricing.documents)) {
                    document.save();

                    res.json({
                        success: true,
                        private: document.private
                     });
                } else {
                    res.error(200, "Private Document Limit Reached. <a href='/account/billing/'>Upgrade Plan</a>");
                }
            } else {
                res.error(200, "Failed To Change Privacy");
            }
        } else {
            res.error(200, "Failed To Change Privacy", error);
        }
    });
}

exports.file_remove = function(req, res, next) {
     req.models.documents.roles.one({
        user_id: req.session.user.id,
        document_pub_id: req.param("document"),
        access: true
    }, function(error, role) {
        if(!error && role) {
            var document = role.document;

            if(document.owner_id == req.session.user.id) {
                document.remove(function(error) {
                    if(!error) {
                        res.json({ success: true });
                    } else {
                        res.error(200, "Failed To Remove File", error);
                    }
                });
            } else {
                role.remove(function(error) {
                    if(!error) {
                        res.json({ success: true });
                    } else {
                        res.error(200, "Failed To Remove File", error);
                    }
                });
            }
        } else {
            res.error(200, "Failed To Remove File", error);
        }
    });
};

/* Locations */
exports.location = function(req, res, next) {
    if(req.param("0") in req.session.user.locations) {
        switch(req.session.user.locations[req.param("0")].type) {
            case (!config.apps.github || "github"):
                req.routes.external.github.contents(req, res, next);
                break;
            case (!config.apps.bitbucket || "bitbucket"):
                req.routes.external.bitbucket.contents(req, res, next);
                break;
            case (!config.apps.google || "google"):
                req.routes.external.google.contents(req, res, next);
                break;
            case (!config.apps.sftp || "sftp"):
                req.routes.external.sftp.contents(req, res, next);
                break;
            default:
                res.error(200, "Location Does Not Exist");
                break;
        }
    } else {
        res.error(200, "Location Does Not Exist");
    }
};

exports.locations = function(req, res, next) {
    if(req.session.user.locations) {
        locations = [];
        $.each(req.session.user.locations, function(key, value) {
            switch(value.type) {
                case ((config.apps.github && req.session.user.github) || "github"):
                    return;
                case ((config.apps.bitbucket && !$.isEmptyObject(req.session.user.bitbucket)) || "bitbucket"):
                    return;
                case ((config.apps.google && !$.isEmptyObject(req.session.user.google)) || "google"):
                    return;
                case (config.apps.sftp || "sftp"):
                    return;
                default:
                    locations.push({
                        key: key,
                        name: value.name,
                        type: value.type
                    });
                    break;
            }
        });
        res.json(locations);
    } else {
        res.json([]);
    }
};

exports.create_location = function(req, res, next) {
    req.models.users.get(req.session.user.id, function(error, user) {
        if(!error) {
            var key = rand.generateKey(Math.floor(Math.random() * 15) + 15);
            user.locations[key] = req.param("location");

            // JSON.cycle is a patch til I figure out why the orm
            // was not saving the changed locations object
            user.save({ locations: JSON.cycle(user.locations) }, function(error, user) {
                if(!error) {
                    req.session.user = user;
                    req.session.save();
                    res.json({ success: true });
                } else {
                    res.error(200, "Failed To Create Location", error);
                }
            });
        } else {
            res.error(200, "Failed To Create Location", error);
        }
    });
};

exports.stats = function(req, res, next) {
    if(req.session.user) {
        async.parallel({
            total: function(callback) {
                req.models.documents.roles.count({
                    user_id: req.session.user.id
                }, function(error, count) {
                    callback(error, count);
                });
            },
            private: function(callback) {
                req.models.documents.count({
                    owner_id: req.session.user.id,
                    private: true
                }, function(error, count) {
                    callback(error, count);
                });
            },
            top_viewed: function(callback) {
                req.models.documents.roles.find({
                    user_id: req.session.user.id
                }, ["viewed", "Z"], 10, function(error, roles) {
                    callback(error, $.map(roles, function(role) {
                        return role.document;
                    }));
                });
            }
        }, function(errors, documents) {
            if(!errors) {
                req.session.user.documents = documents;
            } else {
                req.session.user.documents = {
                    total: 0,
                    password: 0,
                    top_viewed: []
                }
            }
            req.session.save();
            lib.error.capture(errors);
            next();
        });
    } else {
        next();
    }
}
