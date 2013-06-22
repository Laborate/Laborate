var aes = require("../../core/aes");
var crypto = require('crypto');
var rand = require("generate-key");

module.exports = function (db) {
    return db.define("code_documents", {
        name: {
            type: "text",
            required: true
        },
        password: String,
        content: Object,
        breakpoints: Object,
        path: String,
        location: String,
        key: String
    }, {
        hooks: {
            beforeCreate: function(next) {
                var key = rand.generateKey(30);
                this.key = aes.encrypt(key, this.password);
                this.password = (this.password) ? this.hash(this.password) : this.password;
                this.content = (this.content) ? aes.encrypt(JSON.stringify(this.content), key) : this.content;
                if(next) next();
            },
            afterCreate: function(success) {
                if(success) {
                    db.models.code_documents_roles.create({
                        user_id: this.owner_id,
                        document_id: this.id,
                        permission_id: 1
                    });
                }
            },
            beforeRemove: function(next) {
                db.models.code_documents_roles.find({document_id:this.id}).remove(next);
            }
        },
        methods: {
            hash: function(data) {
                return crypto.createHash('md5').update(data).digest("hex");
            }
        }
    });
}
