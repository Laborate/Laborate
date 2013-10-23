/* Modules: NPM */
var fs = require('fs');
var rand = require("generate-key");

/* Modules: Custom */
var github = require("./github");
var file_size = require("../lib/core/file_size");

exports.index = function(req, res, next) {
    res.renderOutdated('documents/index', {
        title: 'Documents',
        navigation: 'Documents Drive',
        mode: "documents",
        user: req.session.user,
        js: clientJS.renderTags("documents", "download"),
        css: clientCSS.renderTags("documents")
    });
};

/* Online Files */
exports.files = function(req, res, next) {
    req.models.documents_roles.find({
        user_id: req.session.user.id
    }, function(error, documents) {
        if(!error) {
            res.json({
                success: true,
                documents: $.map(documents, function(value) {
                    if(value) {
                        return {
                            id: value.document_id,
                            name: value.document.name,
                            protection: (value.document.password != null) ? "password" : "",
                            location: value.document.location,
                            size: file_size.bytes(value.document.content.join("\n")),
                            type: function(name) {
                                var extension = name.split(".")[name.split(".").length-1];

                                if(!extension) {
                                    return "file";
                                } else if(["png", "gif", "jpg", "jpeg", "ico", "wbm"].indexOf(extension) > -1) {
                                    return "file-image";
                                } else if(["html", "jade", "ejs", "erb", "md"].indexOf(extension) > -1) {
                                    return "file-template";
                                } else if(["zip", "tar", "bz", "bz2", "gzip", "gz"].indexOf(extension) > -1) {
                                    return "file-zip";
                                } else {
                                    return "file-script";
                                }
                            }(value.document.name),
                            users: (value.document.roles.length - 1),
                            role: value.permission.name.toLowerCase()
                        }
                    }
                })
            });
        } else {
            res.error(200, "Failed To Load Files");
        }
    });
};

exports.file_create = function(req, res, next) {
    req.models.documents.create({
        name: req.param("name"),
        owner_id: req.session.user.id,
    }, function(error, document) {
        if(!error && document) {
            res.json({
                success: true,
                documents: [{
                    id: document.id,
                    name: document.name,
                    size: file_size.bytes(""),
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
                    role: "owner"
                }]
            });
        } else {
            res.error(200, "Failed To Create Document");
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
            // Type Casting and 100k limit
            if(!((file.type == "" || file.type.match(/(?:text|json|octet-stream)/)) && file.size < 1024 * 100)) {
                file_length -= 1;
                return true;
            }

            req.models.documents.create({
                name: file.name,
                owner_id: req.session.user.id,
                content: fs.readFileSync(file.path, 'utf8').split("\n")
            }, function(error, document) {
                if(!error && document) {
                    fs.unlink(file.path);

                    response.documents.push({
                        id: document.id,
                        name: document.name,
                        size: file_size.bytes(document.content.join("\n")),
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
                        role: "owner"
                    });
                } else {
                    res.error(200, "Failed To Upload Files");
                }
            });
        });
    } else {
        res.error(200, "Failed To Upload Files");
    }
}

exports.file_rename = function(req, res, next) {
    req.models.documents.get(req.param("document"), function(error, document) {
        if(!error && document) {
            document.name = req.param("name");
            document.save();

            res.json({
                success: true,
                document: {
                    id: document.id,
                    name: document.name,
                    type: function(name) {
                        var extension = name.split(".")[name.split(".").length-1];

                        if(!extension) {
                            return "file";
                        } else if(["png", "gif", "jpg", "jpeg", "ico", "wbm"].indexOf(extension) > -1) {
                            return "file-image";
                        } else if(["html", "jade", "ejs", "erb", "md"].indexOf(extension) > -1) {
                            return "file-template";
                        } else if(["zip", "tar", "bz", "bz2", "gzip", "gz"].indexOf(extension) > -1) {
                            return "file-zip";
                        } else {
                            return "file-script";
                        }
                    }(document.name)
                }
             });
        } else {
            res.error(200, "Failed To Rename File");
        }
    });
};

exports.file_remove = function(req, res, next) {
    req.models.documents.get(req.param("document"), function(error, document) {
        if(!error && document) {
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
                    document_id: req.param("0")
                }).remove(function(error) {
                    if(!error) {
                        res.json({ success: true });
                    } else {
                        res.error(200, "Failed To Remove File");
                    }
                });
            }
        } else {
            res.error(200, "Failed To Remove File");
        }
    });
};

/* Locations */
exports.location = function(req, res, next) {
    if(req.session.user.locations && (req.param("0") in req.session.user.locations)) {
        switch(req.session.user.locations[req.param("0")].type) {
            case "github":
                github.contents(req, res, next);
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
        res.json({
            success: true,
            locations: $.map(req.session.user.locations, function(key, value) {
                if(req.session.user.github && value.type == "github") {
                    return {
                        key: key,
                        name: value.name,
                        type: value.type
                    }
                }
            })
        });
    } else {
        res.json([]);
    }
};

exports.create_location = function(req, res, next) {
    req.models.users.get(req.session.user.id, function(error, user) {
        if(!error) {
            req.session.user.locations[rand.generateKey(10)] = req.param("location");
            user.locations = req.session.user.locations;
            user.save();
            res.json({success: true});
        } else {
            res.error(200, "Failed To Create Location");
        }
    });
};

exports.remove_location = function(req, res, next) {
    if(req.session.user.locations && (req.param("locations_remove") in req.session.user.locations)) {
        req.models.users.get(req.session.user.id, function(error, user) {
            if(!error) {
                delete req.session.user.locations[req.param("location")];
                user.locations = req.session.user.locations;
                user.save();
                res.json({success: true});
            } else {
                res.error(200, "Failed To Remove Location");
            }
        });
    } else {
        res.error(200, "Failed To Remove Location");
    }
};
