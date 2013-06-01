var $ = require("jquery");
var mysql = require("../");

/* Documents By User */
exports.documents_by_user = function(callback, id) {
    var connection = mysql.create_connection(connection);

    var sql = "SELECT * FROM code_roles, code_document_roles \
               WHERE code_roles.code_role_id = \
               code_document_roles.code_document_role \
               AND code_user_id=" + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};