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
