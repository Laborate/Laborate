/* Modules: NPM */
var $ = require("jquery");
var async = require("async");

/* Modules: Custom */
var github = require("./github");
var aes = require("../lib/core/aes");
var user_mysql = require("../lib/mysql/users");
var documments_mysql = require("../lib/mysql/users/documents");
var load_dependencies = require("../lib/core/dependencies");

exports.index = function(req, res) {
    load_dependencies(req);

    var data = {
        title: 'Documents',
        mode: 'Documents Drive',
        user: req.session.user,
        js: req.app.get("clientJS").renderTags("core", "documents", "header"),
        css: req.app.get("clientCSS").renderTags("core", "documents", "header", "icons")
    }

    res.render('documents', data);
};

exports.files = function(req, res) {
    async.series({
        user_files: function(callback) {
            documments_mysql.documents_by_user(callback, req.session.user.id);
        }
    }, function(error, results) {
        if(!error) {
            var files = [];

            $.each(results.user_files, function(key, value) {
                files.push({
                    id: value.code_document_id,
                    name: value.code_document_name,
                    password: value.code_document_password,
                    location: value.code_document_location,
                    role: value.code_role_name
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

/* Locations */
exports.location = function(req, res) {
    if(req.session.user.code_locations && (req.param("0") in req.session.user.code_locations)) {
        switch(req.session.user.code_locations[req.param("0")].type) {
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
            if(req.session.user.code_locations) {
                locations = [];
                $.each(req.session.user.code_locations, function(key, value) {
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
    async.series([
        function(callback) {
            if(!req.session.user.code_locations) {
                req.session.user.code_locations = {}
            }

            req.session.user.code_locations[req.param("locations_add")[0]] = req.param("locations_add")[1];
            callback(null);
        },
        function(callback) {
            var locations = aes.encrypt(JSON.stringify(req.session.user.code_locations), req.session.user.email);
            user_mysql.user_locations(callback, req.session.user.id, locations);
        }
    ], function(error) {
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
    if(req.session.user.code_locations && (req.param("locations_remove") in req.session.user.code_locations)) {
        async.series([
            function(callback) {
                delete req.session.user.code_locations[req.param("locations_remove")];
                callback(null);
            },
            function(callback) {
                if(Object.keys(req.session.user.code_locations).length == 0) {
                    var locations = null;
                } else {
                    var locations = aes.encrypt(JSON.stringify(req.session.user.code_locations), req.session.user.email);
                }
                user_mysql.user_locations(callback, req.session.user.id, locations);
            }
        ], function(error) {
            if(error) {
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
