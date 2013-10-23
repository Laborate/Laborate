var aes = require("../../core/aes");
var crypto = require('crypto');
var rand = require("generate-key");

module.exports = function (db, models) {
    return db.define("code_documents", {
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
        path: String,
        location: String,
        key: String,
        created: {
            type: "date",
            defaultValue: new Date()
        },
        updated: {
            type: "date",
            defaultValue: new Date()
        }
    }, {
        hooks: {
            afterCreate: function() {
                this.key = aes.encrypt(rand.generateKey(30), this.password);
                if(this.password) this.password = this.hash(this.password);
            },
            afterCreate: function(success) {
                if(success) {
                    models.documents_roles.create({
                        user_id: this.owner_id,
                        document_id: this.id,
                        permission_id: 1
                    }, function() {});
                }
            },
            afterLoad: function() {
                if(!this.content) this.content = [];
                if(!this.breakpoints) this.breakpoints = [];
            },
            beforeRemove: function(next) {
                models.documents_roles.find({document_id:this.id}).remove(next);
            }
        },
        methods: {
            hash: function(data) {
                return crypto.createHash('md5').update(data).digest("hex");
            },
            join: function(user, permission) {
                document_id = this.id;
                models.documents_roles.exists({
                    user_id: user,
                    document_id: document_id
                }, function(error, exists) {
                    if(!exists) {
                        models.documents_roles.create({
                            user_id: user,
                            document_id: document_id,
                            permission_id: permission
                        }, function() {});
                    }
                });
            }
        }
    });
}
