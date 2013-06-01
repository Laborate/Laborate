var $ = require("jquery");
var mysql = require("../");

/* Documents By User */
exports.documents_by_user = function(callback, id) {
    var connection = mysql.create_connection(connection);

    var sql = "SELECT * FROM code_allocations, code_document_allocations \
               WHERE code_allocations.code_allocation_id = \
               code_document_allocations.code_document_allocation \
               AND code_user_id=" + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};