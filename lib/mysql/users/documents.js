var $ = require("jquery");
var mysql = require("../");

/* Insert Document */
exports.document_insert = function(document, callback) {
    var connection = mysql.create_connection(connection);

    $.each(document, function(index, value) {
        document[index] = connection.escape(value);
    });

    var sql = "INSERT INTO code_documents \
               (code_document_name, code_document_content, code_document_owner, \
               code_document_external_path, code_document_location_id) \
               VALUES (" + document.join(", ") + ")";

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

/* Update Document */
exports.document_rename = function(id, name, callback) {
    var connection = mysql.create_connection(connection);

    var sql = "UPDATE code_documents \
               SET code_document_name = " + connection.escape(name) + "\
               WHERE code_document_id = " + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

/* Delete Document */
exports.document_remove = function(id, callback) {
    var connection = mysql.create_connection(connection);

    var sql = "DELETE FROM code_documents \
               WHERE code_document_id = " + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

/* Documents By User */
exports.documents_by_user = function(id, callback) {
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
