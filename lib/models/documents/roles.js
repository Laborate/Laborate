var models = require("../");

module.exports = function (db, models) {
    return db.define("documents_roles", {
        document_pub_id: {
            type: "text",
            required: true
        },
        viewed: {
            type: "number",
            required: true,
            defaultValue: 0
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
            permission_id: db.validators.rangeNumber(1, 3)
        }
    });
}
