module.exports = function (db, models) {
    return db.define("notifications", {
        message: {
            type: "text",
            required: true
        },
        priority: {
            type: "boolean",
            required: true,
            defaultValue: false
        },
        viewed: {
            type: "boolean",
            required: true,
            defaultValue: false
        }
    }, {
        timestamp: true
    });
}
