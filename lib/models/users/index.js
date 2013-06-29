var config = require("../../../config");
var aes = require("../../core/aes");
var crypto = require('crypto');
var rand = require("generate-key");
var uuid = require('node-uuid');

module.exports = function (db, models) {
    var users = db.define("users", {
        name: {
            type: "text",
            required: true
        },
        screen_name: {
            type: "text",
            required: true
        },
        email: {
            type: "text",
            required: true
        },
        password: {
            type: "text",
            required: true
        },
        admin: {
            type: "boolean",
            required: true,
            defaultValue: false
        },
        verified: String,
        locations: {
            type: "object",
            big: true
        },
        github: String,
        recovery: String,
        key: String
    }, {
        hooks: {
            beforeCreate: function(next) {
                if(!this.admin) {
                    this.verified = rand.generateKey(10).toLowerCase();
                }

                this.key = aes.encrypt(rand.generateKey(30), this.password);
                this.password = this.hash(this.password);
                if(next) next();
            },
            afterLoad: function() {
                this.email_hash = this.hash(this.email);
            }
        },
        methods: {
            hash: function(data) {
                return crypto.createHash('md5').update(data).digest("hex");
            },
            set_recovery: function(req, res) {
                this.recovery = uuid.v4();

                res.cookie(config.cookies.rememberme, this.recovery, {
                    maxAge: 9000000000,
                    httpOnly: true,
                    domain: "." + req.host.replace(/^[^.]+\./g, "")
                });
            }
        },
        validations: {
            email: [
                db.validators.patterns.email(),
                db.validators.unique(),
            ]
        }
    });

    users.hash = function(data) {
        return crypto.createHash('md5').update(data).digest("hex");
    }

    return users;
};
