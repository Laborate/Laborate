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
        hooks: {
            beforeSave: function() {
                this.updated = new Date();
            }
        },
        validations: {
            name: [
                db.validators.unique(),
            ]
        }
    });
}
