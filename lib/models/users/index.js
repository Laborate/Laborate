var config = require("../../../config");
var aes = require("../../core/aes");
var crypto = require('crypto');
var rand = require("generate-key");
var uuid = require('node-uuid');

module.exports = function (db) {
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
        verified: String,
        locations: {
            type: "text",
            size: 1000
        },
        github: String,
        recovery: String,
        key: String
    }, {
        hooks: {
            beforeCreate: function(next) {
                var key = rand.generateKey(30);
                this.verified = rand.generateKey(10).toLowerCase();
                this.key = aes.encrypt(key, this.password);
                this.password = this.hash(this.password);
                this.locations = (this.locations) ? aes.encrypt(this.locations, key) : this.locations;
                this.github = (this.github) ? aes.encrypt(this.github, key) : this.github;
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
            set_recovery: function(res) {
                this.recovery = uuid.v4();

                res.cookie(config.cookies.rememberme, this.recovery, {
                    maxAge: 9000000000,
                    httpOnly: true
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
