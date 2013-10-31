module.exports = function (db, models) {
    return db.define("user_pricing", {
        name: {
            type: "text",
            required: true
        },
        cost: {
            type: "number",
            required: true
        },
        documents: {
            type: "number"
        },
        pro: {
            type: "boolean",
            defaultValue: false
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
            ],
            cost: [
                db.validators.unique(),
            ]
        }
    });
}
