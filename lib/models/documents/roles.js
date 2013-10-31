var models = require("../");

module.exports = function (db, models) {
    return db.define("documents_roles", {
        document_pub_id: {
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
            document_pub_id: db.validators.unique(),
            permission_id: db.validators.rangeNumber(1, 3)
        }
    });
}
