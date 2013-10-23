module.exports = function (db, models) {
    return db.define("code_user_pricing", {
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
