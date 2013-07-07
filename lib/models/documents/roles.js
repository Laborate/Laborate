var models = require("../");

module.exports = function (db, models) {
    return db.define("code_documents_roles", {
        key: String
    }, {
        validations: {
            permission_id: db.validators.rangeNumber(1, 3)
        }
    });
}
