var $ = require("jquery");
var mysql = require("../");

/* Documents By User */
exports.documents_by_user = function(callback, id) {
    var connection = mysql.create_connection(connection);

    var sql = "SELECT * FROM code_documents \
               WHERE document_owner=" + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};