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
        key: String
    }, {
        hooks: {
            beforeCreate: function(next) {
                this.key = aes.encrypt(rand.generateKey(30), this.password);
                this.password = (this.password) ? this.hash(this.password) : this.password;
                if(next) next();
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
            beforeRemove: function(next) {
                models.documents_roles.find({document_id:this.id}).remove(next);
            }
        },
        methods: {
            hash: function(data) {
                return crypto.createHash('md5').update(data).digest("hex");
            }
        }
    });
}
