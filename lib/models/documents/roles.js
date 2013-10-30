var models = require("../");

module.exports = function (db, models) {
    return db.define("code_documents_roles", {
        document_slug: {
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
            document_slug: db.validators.unique(),
            permission_id: db.validators.rangeNumber(1, 3)
        }
    });
}
