var models = require("../");

module.exports = function (db, models) {
    return db.define("documents_permissions", {
        name: {
            type: "text",
            required: true
        },
        own: {
            type: "boolean",
            defaultValue: false
        },
        readonly: {
            type: "boolean",
            defaultValue: false
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
