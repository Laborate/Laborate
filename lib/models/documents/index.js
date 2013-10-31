var aes = require("../../core/aes");
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
            beforeCreate: function() {
                this.pub_id = rand.generateKey(Math.floor(Math.random() * 15) + 15);
                this.key = aes.encrypt(rand.generateKey(30), this.password);
                if(this.password) this.password = this.hash(this.password);
                if(!this.content) this.content = [];
                this.breakpoints = [];
            },
            beforeSave: function() {
                this.updated = new Date();
            },
            beforeRemove: function(next) {
                models.documents_roles.find({document_id:this.id}).remove(next);
            },
            afterCreate: function(success) {
                if(success) {
                    models.documents_roles.create({
                        user_id: this.owner_id,
                        document_id: this.id,
                        document_pub_id: this.pub_id,
                        permission_id: 1
                    }, blank_function);
                }
            }
        },
        methods: {
            hash: function(data) {
                return crypto.createHash('md5').update(data).digest("hex");
            },
            join: function(user, permission) {
                _this = this;
                models.documents_roles.exists({
                    user_id: user,
                    document_id: _this.id
                }, function(error, exists) {
                    if(!exists) {
                        models.documents_roles.create({
                            user_id: user,
                            document_id: _this.id,
                            document_pub_id: _this.pub_id,
                            permission_id: permission
                        }, blank_function);
                    }
                });
            }
        },
        validations: {
            pub_id: db.validators.unique()
        }
    });
}
