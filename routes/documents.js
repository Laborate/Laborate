/* Modules: NPM */
var $ = require("jquery");
var async = require("async");
var rand = require("generate-key");

/* Modules: Custom */
var github = require("./github");

exports.index = function(req, res) {
    var data = {
        title: 'Documents',
        navigation: 'Documents Drive',
        mode: "documents",
        user: req.session.user,
        js: clientJS.renderTags("documents", "header"),
        css: clientCSS.renderTags("documents", "header", "icons")
    }
    res.render('documents', data);
};

/* Online Files */
exports.files = function(req, res) {
    req.models.documents_roles.find({
        user_id: req.session.user.id
    }, function(error, documents) {
        if(!error) {
            var files = [];
            $.each(documents, function(key, value) {
                files.push({
                    id: value.document_id,
                    name: value.document.name,
                    password: (value.document.password),
                    location: value.document.location,
                    role: value.permission.name
                });
            });

            res.json(files);
        } else {
            res.json({
                success: false,
                error_message: "Failed To Load Files"
            });
        }
    });
};

exports.file_create = function(req, res) {
    var path = req.param("external_path");
    req.models.documents.create({
        name: req.param("name"),
        owner_id: req.session.user.id,
        path: (path.slice(-1) == "/") ? path.slice(0, -1) : path,
        location: req.param("location")
    }, function(error, document) {
        if(!error) {
            res.json({document: document.id});
        } else {
            res.json({
                success: false,
                error_message: "Failed To Create Document"
            });
        }
    });
};

exports.file_rename = function(req, res) {
    req.models.documents.get(req.param("0"), function(error, document) {
        if(!error) {
            document.name = req.param("name");
            res.json({ success: true });
        } else {
            res.json({
                success: false,
                error_message: "Failed To Rename File"
            });
        }
    });
};

exports.file_remove = function(req, res) {
    req.models.documents.get(req.param("0"), function(error, document) {
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
};

/* Locations */
exports.location = function(req, res) {
    if(req.session.user.locations && (req.param("0") in req.session.user.locations)) {
        switch(req.session.user.locations[req.param("0")].type) {
            case "github":
                github.contents(req, res);
                break;
            default:
                res.json({
                    success: false,
                    error_message: "Location Type Unknown"
                });
                break;
        }
    } else {
        res.json({
            success: false,
            error_message: "Location Does Not Exist"
        });
    }
};

exports.locations = function(req, res) {
    async.series({
        locations: function(callback) {
            if(req.session.user.locations) {
                locations = [];
                $.each(req.session.user.locations, function(key, value) {
                    if(!req.session.user.github && value.type == "github") {
                        return;
                    }

                    locations.push({
                        key: key,
                        name: value.name,
                        type: value.type
                    })
                });
                callback(null, locations);
            } else {
                callback(null, []);
            }
        }
    }, function(error, results) {
        if(!error) {
            res.json(results.locations);
        } else {
            res.json({
                success: false,
                error_message: "Failed To Load Locations"
            });
        }
    });
};

exports.create_location = function(req, res) {
    req.models.users.get(req.session.user.id, function(error, user) {
        if(!req.session.user.locations) {
            req.session.user.locations = {}
        }

        req.session.user.locations[rand.generateKey(10)] = req.param("locations_add");
        user.locations = req.session.user.locations;

        if(!error) {
            res.json({success: true});
        } else {
            res.json({
                success: false,
                error_message: "Failed To Create Location"
            });
        }
    });
};

exports.remove_location = function(req, res) {
    if(req.session.user.locations && (req.param("locations_remove") in req.session.user.locations)) {
        req.models.users.get(req.session.user.id, function(error, user) {
            delete req.session.user.locations[req.param("locations_remove")];
            user.locations = req.session.user.locations;

            if(!error) {
                res.json({success: true});
            } else {
                res.json({
                    success: false,
                    error_message: "Failed To Remove Location"
                });
            }
        });
    } else {
        res.json({
            success: false,
            error_message: "Failed To Remove Location"
        });
    }
};
