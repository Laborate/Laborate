var models = require("../");

module.exports = function (db) {
    return db.define("code_documents_calculated", {
        password: {
            type: "boolean",
            required: true
        },
    });
}
