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
exports.user_insert = function(info, callback) {
    var connection = mysql.create_connection(connection);
    var new_info = [];

    $.each(info, function(index, value) {
        new_info.push(connection.escape(value));
    });

    var sql = "INSERT INTO users \
               (user_name, user_screen_name, user_email, user_password, user_activated) \
               VALUES (" + new_info.join(", ") + ")";

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

exports.user_insert_recovery = function(id, uuid, callback) {
    var connection = mysql.create_connection(connection);

    // Remove Existing Records Associated With User ID
    var remove_sql = "DELETE FROM users_recovery \
               WHERE recovery_user_id = " + connection.escape(id);

    connection.query(remove_sql, function(error, result) {
        if(!error && result) {
            var sql = "INSERT INTO users_recovery \
                       (recovery_user_id, recovery_uuid) \
                       VALUES (" + connection.escape(id) + ", \
                       " + connection.escape(uuid) + ")";

            connection.query(sql, function(error, result) {
                connection.end();
                if(callback) callback(error, result);
            });
        } else {
            if(callback) callback(error, result);
        }
    });
};


/* Update User Info */
exports.user_activation = function(id, code, callback) {
    var connection = mysql.create_connection(connection);

    var sql = "UPDATE users SET \
               user_activated=" + connection.escape(code) + " \
               WHERE user_id=" + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

exports.user_github_token = function(id, token, callback) {
    var connection = mysql.create_connection(connection);

    var sql = "UPDATE users SET \
               user_github=" + connection.escape(token) + " \
               WHERE user_id=" + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

exports.user_locations = function(id, locations, callback) {
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
exports.user_by_id = function(id, callback) {
    var connection = mysql.create_connection(connection);
    var sql = "SELECT * FROM users, code_user_pricing WHERE \
               users.user_code_pricing = code_user_pricing.pricing_id \
               AND user_id = " + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

exports.user_by_email = function(email, callback) {
    var connection = mysql.create_connection(connection);
    var sql = "SELECT * FROM users, code_user_pricing WHERE \
               users.user_code_pricing = code_user_pricing.pricing_id \
               AND user_email = " + connection.escape(email);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

exports.user_by_uuid = function(uuid, callback) {
    var connection = mysql.create_connection(connection);
    var sql = "SELECT * FROM users_recovery \
               WHERE recovery_uuid = " + connection.escape(uuid);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

/* Counts By Identifier */
exports.user_by_id_count = function(id, callback) {
    var connection = mysql.create_connection(connection);
    var sql = "SELECT COUNT(*) FROM users WHERE user_id = " + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result[0]["COUNT(*)"]);
    });
};


exports.user_by_email_count = function(email, callback) {
    var connection = mysql.create_connection(connection);
    var sql = "SELECT COUNT(*) FROM users WHERE user_email = " + connection.escape(email);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result[0]["COUNT(*)"]);
    });
};


exports.user_pass_documents_count = function(id, callback) {
    var connection = mysql.create_connection(connection);
    var sql = "SELECT COUNT(*) FROM code_documents \
               WHERE code_document_password IS NOT NULL \
               AND code_document_owner = " + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result[0]["COUNT(*)"]);
    });
};
