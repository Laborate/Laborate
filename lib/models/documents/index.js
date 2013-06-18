var models = require("../");

module.exports = function (db) {
    return db.define("code_documents", {
        name: {
            type: "text",
            required: true
        },
        password: String,
        content: Object,
        breakpoints: Object,
        path: String,
        location: String,
        key: {
            type: "text",
            required: true
        }
    });
}
