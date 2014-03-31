var aes = require("../../core/aes");
var file_size = require("../../core/file_size");
var crypto = require('crypto');
var rand = require("generate-key");

module.exports = function (db, models) {
    return db.define("documents", {
        pub_id: String,
        name: {
            type: "text",
            required: true
        },
        private: {
            type: "boolean",
            defaultValue: false
        },
        readonly: {
            type: "boolean",
            defaultValue: false
        },
        content: {
            type: "object",
            big: true
        },
        breakpoints: {
            type: "object",
            big: true
        },
        viewed: {
            type: "number",
            required: true,
            defaultValue: 0
        },
        path: String,
        location: String,
        key: String
    }, {
        timestamp: true,
        hooks: {
            beforeCreate: function() {
                this.pub_id = rand.generateKey(Math.floor(Math.random() * 15) + 15);
                this.key = aes.encrypt(rand.generateKey(30), this.password);
                if(!this.content) this.content = [];
                this.breakpoints = [];
            },
            afterRemove: function(sucess) {
                if(sucess) {
                    models.documents.roles.find({
                        document_id: this.id
                    }).remove(lib.error.capture);
                }
            },
            afterCreate: function(success) {
                if(success) {
                    var _this = this;
                    models.users.get(this.owner_id, function(error, user) {
                        models.documents.roles.create({
                            user_id: user.id,
                            user_pub_id: user.pub_id,
                            document_id: _this.id,
                            document_pub_id: _this.pub_id,
                            permission_id: 1
                        }, lib.error.capture);
                        lib.error.capture(error);
                    });
                }
            }
        },
        methods: {
            hash: function(data) {
                return crypto.createHash('md5').update(data).digest("hex");
            },
            join: function(user, permission, callback) {
                _this = this;
                models.documents.roles.one({
                    user_id: user.id,
                    document_id: _this.id
                }, function(error, role) {
                    if(!error) {
                        if(!role && !_this.private) {
                            models.documents.roles.create({
                                user_id: user.id,
                                user_pub_id: user.pub_id,
                                document_id: _this.id,
                                document_pub_id: _this.pub_id,
                                permission_id: permission,
                                viewed: 1
                            }, lib.error.capture);
                            callback(true, {
                                owner: false,
                                readonly: false
                            });
                        } else if(role && role.access) {
                            _this.save({
                                viewed: _this.viewed + 1
                            }, lib.error.capture);

                            role.save({
                                viewed: role.viewed + 1
                            }, lib.error.capture);

                            callback(true, {
                                owner: role.permission.owner,
                                readonly: role.permission.readonly
                            });
                        }  else {
                            callback(false);
                        }
                    } else {
                        callback(false, false);
                        lib.error.capture(error);
                    }
                });
            },
            invite: function(user, permission, callback) {
                _this = this;
                models.documents.roles.exists({
                    user_id: user.id,
                    document_id: _this.id
                }, function(error, exits) {
                    if(!error) {
                        if(!exits) {
                            models.documents.roles.create({
                                user_id: user.id,
                                user_pub_id: user.pub_id,
                                document_id: _this.id,
                                document_pub_id: _this.pub_id,
                                permission_id: permission,
                                viewed: 1
                            }, lib.error.capture);
                            callback(true);
                        } else {
                            callback(false, "Access Already Granted");
                        }
                    } else {
                        callback(false);
                        lib.error.capture(error);
                    }
                });
            },
            size: function(formatted) {
                if(formatted) {
                    return file_size.size(this.content.join("\n"));
                } else {
                    return file_size.bytes(this.content.join("\n"));
                }
            },
            type: function() {
                var name = this.name;
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
            },
            is_readonly: function(user, callback) {
                var _this = this;
                models.documents.roles.exists({
                    document_id: _this.id,
                    user_id: user
                }, function(error, readonly) {
                    if(user == document.owner_id) {
                        callback(false);
                    } else {
                        callback(_this.readonly || readonly);
                    }
                });
            }
        },
        validations: {
            pub_id: db.enforce.unique()
        }
    });
}
