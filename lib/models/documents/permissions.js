var models = require("../");

module.exports = function (db, models) {
    return db.define("documents_permissions", {
        name: {
            type: "text",
            required: true
        },
        owner: {
            type: "boolean",
            defaultValue: false
        },
        readonly: {
            type: "boolean",
            defaultValue: false
        },
        access: {
            type: "boolean",
            defaultValue: true
        },
        description: {
            type: "text",
            required: true
        }
    }, {
        timestamp: true,
        validations: {
            name: db.enforce.unique(),
            description: db.enforce.unique()
        }
    });
}
