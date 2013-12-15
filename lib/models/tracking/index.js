module.exports = function (db, models) {
    return db.define("tracking", {
        type: {
            type: "text",
            required: true
        },
        ip: {
            type: "number",
            required: true
        },
        port: {
            type: "number",
            required: true
        },
        lat: {
            type: "number",
            required: true
        },
        lon: {
            type: "number",
            required: true
        },
        created: {
            type: "date",
            defaultValue: new Date()
        }
    }, {
        validations: {
            ip: db.enforce.patterns.ipv4(),
        }
    });
}
