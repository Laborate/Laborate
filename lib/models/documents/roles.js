var models = require("../");

module.exports = function (db, models) {
    return db.define("code_documents_roles", {}, {
        validations: {
            permission_id: db.validators.rangeNumber(1, 3)
        }
    });
}
