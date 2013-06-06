var $ = require("jquery");
var mysql = require("../");

/* All Users */
exports.users = function(callback) {
    var connection = mysql.create_connection(connection);
    var sql = "SELECT * FROM users";

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

/* Insert User */
exports.user_insert = function(callback, info) {
    var connection = mysql.create_connection(connection);
    var new_info = [];
    $.each(info, function(index, value) {
        new_info.push(connection.escape(value));
    });

    var sql = "INSERT INTO users \
               (user_name, user_screen_name, user_email, user_password) \
               VALUES (" + new_info.join(", ") + ")";

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

/* Update User Info */
exports.user_github_token = function(callback, id, token) {
    var connection = mysql.create_connection(connection);

    var sql = "UPDATE users SET \
               user_github=" + connection.escape(token) + " \
               WHERE user_id=" + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

exports.user_locations = function(callback, id, locations) {
    var connection = mysql.create_connection(connection);

    var sql = "UPDATE users SET \
               user_locations=" + connection.escape(locations) + " \
               WHERE user_id=" + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

/* Listing By Identifier */
exports.user_by_id = function(callback, id) {
    var connection = mysql.create_connection(connection);
    var sql = "SELECT * FROM users, code_user_pricing WHERE \
               users.code_user_pricing = code_user_pricing.pricing_id \
               AND user_id = " + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

exports.user_by_email = function(callback, email) {
    var connection = mysql.create_connection(connection);
    var sql = "SELECT * FROM users, code_user_pricing WHERE \
               users.code_user_pricing = code_user_pricing.pricing_id \
               AND user_email = " + connection.escape(email);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

/* Counts By Identifier */
exports.user_by_id_count = function(callback, id) {
    var connection = mysql.create_connection(connection);
    var sql = "SELECT COUNT(*) FROM users WHERE user_id = " + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result[0]["COUNT(*)"]);
    });
};


exports.user_by_email_count = function(callback, email) {
    var connection = mysql.create_connection(connection);
    var sql = "SELECT COUNT(*) FROM users WHERE user_email = " + connection.escape(email);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result[0]["COUNT(*)"]);
    });
};


exports.user_pass_documents_count = function(callback, id) {
    var connection = mysql.create_connection(connection);
    var sql = "SELECT COUNT(*) FROM code_documents \
               WHERE code_document_password IS NOT NULL \
               AND code_document_owner = " + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result[0]["COUNT(*)"]);
    });
};
