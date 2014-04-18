module.exports = function (db, models) {
    return db.define("analytics", {
        files: {
            type: "number",
            required: true
        },
        lines: {
            type: "number",
            required: true
        },
        messages: {
            type: "number",
            required: true
        },
        users: {
            type: "number",
            required: true
        },
        views: {
            type: "number",
            required: true
        }
    }, {
        timestamp: true,
    });
}
