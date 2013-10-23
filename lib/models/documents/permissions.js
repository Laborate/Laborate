var models = require("../");

module.exports = function (db, models) {
    return db.define("code_documents_permissions", {
        name: {
            type: "text",
            required: true
        },
        description: {
            type: "text",
            required: true
        },
        created: {
            type: "date",
            defaultValue: new Date()
        },
        updated: {
            type: "date",
            defaultValue: new Date()
        }
    }, {
        cache: true,
        validations: {
            name: [
                db.validators.unique(),
            ]
        }
    });
}
