var aes = require("../../core/aes");
var file_size = require("../../core/file_size");
var crypto = require('crypto');
var rand = require("generate-key");

module.exports = function (db, models) {
    return db.define("documents", {
        pub_id: {
            type: "text"
        },
        name: {
            type: "text",
            required: true
        },
        password: String,
        content: {
            type: "object",
            big: true
        },
        breakpoints: {
            type: "object",
            big: true
        },
        readonly: {
            type: "boolean",
            defaultValue: false
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
                if(this.password) this.password = this.hash(this.password);
                if(!this.content) this.content = [];
                this.breakpoints = [];
            },
            beforeRemove: function() {
                models.documents.roles.find({
                    document_id: this.id
                }).remove(lib.error.capture);
            },
            afterCreate: function(success) {
                if(success) {
                    models.documents.roles.create({
                        user_id: this.owner_id,
                        document_id: this.id,
                        document_pub_id: this.pub_id,
                        permission_id: 1
                    }, lib.error.capture);
                }
            }
        },
        methods: {
            hash: function(data) {
                return crypto.createHash('md5').update(data).digest("hex");
            },
            join: function(user, permission, callback) {
                _this = this;
                models.documents.roles.find({
                    user_id: user,
                    document_id: _this.id
                }, function(error, documents) {
                    if(!error) {
                        if(documents.length != 1) {
                            models.documents.roles.create({
                                user_id: user,
                                document_id: _this.id,
                                document_pub_id: _this.pub_id,
                                permission_id: permission,
                                viewed: 1
                            }, lib.error.capture);
                            callback(true);
                        } else {
                            if(documents[0].access) {
                                documents[0].save({
                                    viewed: documents[0].viewed + 1
                                }, callback || lib.error.capture);
                                callback(true);
                            } else {
                                callback(true, true);
                            }
                        }
                    } else {
                        callback(false, false);
                        lib.error.capture(error);
                    }
                });
            },
            invite: function(user, permission, callback) {
                _this = this;
                models.documents.roles.find({
                    user_id: user,
                    document_id: _this.id
                }, function(error, documents) {
                    if(!error) {
                        if(documents.empty) {
                            models.documents.roles.create({
                                user_id: user,
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
