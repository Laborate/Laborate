module.exports = function (db, models) {
    return db.define("pricing", {
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
        documents: Number,
        pro: {
            type: "boolean",
            defaultValue: false
        },
        student: {
            type: "boolean",
            defaultValue: false
        },
        organization: {
            type: "boolean",
            defaultValue: false
        },
        priority: {
            type: "number",
            required: true
        }
    }, {
        timestamp: true,
        validations: {
            name: db.enforce.unique(),
            plan: db.enforce.unique()
        }
    });
}
