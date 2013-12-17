var models = require("../");

module.exports = function (db, models) {
    return db.define("organizations_permissions", {
        name: {
            type: "text",
            required: true
        },
        description: {
            type: "text",
            required: true
        },
        admin: {
            type: "boolean",
            required: true,
            defaultValue: false
        },
        owner: {
            type: "boolean",
            required: true,
            defaultValue: false
        },
        owned: {
            type: "boolean",
            required: true,
            defaultValue: true
        },
        student: {
            type: "boolean",
            defaultValue: false
        }
    }, {
        timestamp: true,
        validations: {
            name: db.enforce.unique(),
            description: db.enforce.unique()
        }
    });
}
