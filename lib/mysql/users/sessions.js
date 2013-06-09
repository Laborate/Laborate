var $ = require("jquery");
var mysql = require("../");

/* Insert Session */
exports.session_insert = function(session, callback) {
    var connection = mysql.create_connection(connection);

    $.each(session, function(index, value) {
        session[index] = connection.escape(value);
    });

    var sql = "INSERT INTO code_documents \
               (code_document_name, code_document_content, code_document_owner, \
               code_document_external_path, code_document_location_id) \
               VALUES (" + session.join(", ") + ")";

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};
