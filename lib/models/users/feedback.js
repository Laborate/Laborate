module.exports = function (db, models) {
    return db.define("users_feedback", {
        feedback: {
            type: "object",
            required: true
        }
    }, {
        timestamp: true
    });
}
