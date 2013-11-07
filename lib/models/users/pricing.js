module.exports = function (db, models) {
    return db.define("user_pricing", {
        name: {
            type: "text",
            required: true
        },
        plan: {
            type: "text",
            required: true
        },
        interval: {
            type: "text",
            required: true
        },
        interval_count: {
            type: "number",
            required: true
        },
        amount: {
            type: "number",
            required: true
        },
        currency: {
            type: "text",
            required: true,
            defaultValue: "usd"
        },
        trial: {
            type: "number",
            required: true,
            defaultValue: 0
        },
        documents: Number,
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
