module.exports = function (db, models) {
    return db.define("tracking", {
        type: String,
        agent: String,
        url: String,
        ip: String,
        port: String,
        lat: Number,
        lon: Number,
        city: String,
        state: String,
        country: String
    }, {
        timestamp: true
    });
}
