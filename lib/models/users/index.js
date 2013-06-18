var aes = require("../../core/aes");
var crypto = require('crypto');
var rand = require("generate-key");

module.exports = function (db) {
    return db.define("users", {
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
        verified: Number,
        locations: Object,
        github: String,
        recovery: String,
        key: {
            type: "text",
            required: true
        }
    }, {
        methods: {
            hash: function(data) {
                return crypto.createHash('md5').update(data).digest("hex");
            }
        },
        validations: {
            email: [
                db.validators.patterns.email(),
                db.validators.unique(),
            ]
        }
    });
};
