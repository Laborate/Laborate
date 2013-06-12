/* Modules: NPM */
var $ = require("jquery");
var async = require("async");

/* Modules: Custom */
var github = require("./github");
var aes = require("../lib/core/aes");
var user_mysql = require("../lib/mysql/users");
var user_documents_mysql = require("../lib/mysql/users/documents");

exports.index = function(req, res) {
    var data = {
        title: 'Documents',
        mode: 'Documents Drive',
        user: req.session.user,
        js: clientJS.renderTags("documents", "header"),
        css: clientCSS.renderTags("documents", "header", "icons")
    }
    res.render('documents', data);
};

/* Online Files */
exports.files = function(req, res) {
    async.series({
        user_files: function(callback) {
            user_documents_mysql.documents_by_user(req.session.user.id, callback);
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

exports.file_create = function(req, res) {
    var path = req.param("external_path");
    var document = [
        req.param("name"),
        JSON.stringify([]),
        req.session.user.id,
        (path.slice(-1) == "/") ? path.slice(0, -1) : path,
        req.param("location")
    ];
    user_documents_mysql.document_insert(document, function(error, results) {
        if(!error) {
            res.json({document: results.insertId});
        } else {
            res.json({
                success: false,
                error_message: "Failed To Create Document"
            });
        }
    });
};

exports.file_rename = function(req, res) {
    user_documents_mysql.document_rename(req.param("0"), req.param("name"), function(error, data) {
        if(!error) {
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
    user_documents_mysql.document_remove(req.param("0"), function(error, data) {
        if(!error) {
            res.json({ success: true });
        } else {
            res.json({
                success: false,
                error_message: "Failed To Rename File"
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
            user_mysql.user_locations(req.session.user.id, locations, callback);
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
                user_mysql.user_locations(req.session.user.id, locations, callback);
            }
        ], function(error) {
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
