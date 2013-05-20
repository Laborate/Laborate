var $ = require("jquery");
var mysql = require("./mysql");

/* User: All Users */
exports.users = function(callback) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT * FROM users";

        connection.query(sql, function(err, result) {
            connection.end();
            if(callback) callback(null, result);
        });
    });
};

/* User: Insert User */
exports.user_insert = function(callback, info) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var new_info = [];
        $.each(info, function(index, value) {
            new_info.push(connection.escape(value));
        });

        var sql = "INSERT INTO users \
                   (user_name, user_screen_name, user_email, user_password) \
                   VALUES (" + new_info.join(", ") + ")";

        connection.query(sql, function(err, result) {
            connection.end();
            if(callback) callback(null, result);
        });
    });
};

/* User: Listing BY Identifier */
exports.user_by_id = function(callback, id) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT * FROM users, users_pricing WHERE \
                   users.user_pricing = users_pricing.pricing_id \
                   AND user_id = " + connection.escape(id);

        connection.query(sql, function(err, result) {
            connection.end();
            if(callback) callback(null, result);
        });
    });
};

exports.user_by_email = function(callback, email) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT * FROM users, users_pricing WHERE \
                   users.user_pricing = users_pricing.pricing_id \
                   AND user_email = " + connection.escape(email);

        connection.query(sql, function(err, result) {
            connection.end();
            if(callback) callback(null, result);
        });
    });
};

/* User: Counts BY Identifier */
exports.user_by_id_count = function(callback, id) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT COUNT(*) FROM users WHERE user_id = " + connection.escape(id);

        connection.query(sql, function(err, result) {
            connection.end();
            if(callback) callback(null, result[0]["COUNT(*)"]);
        });
    });
};


exports.user_by_email_count = function(callback, email) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT COUNT(*) FROM users WHERE user_email = " + connection.escape(email);

        connection.query(sql, function(err, result) {
            connection.end();
            if(callback) callback(null, result[0]["COUNT(*)"]);
        });
    });
};


exports.user_pass_sessions_count = function(callback, id) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT COUNT(*) FROM sessions \
                   WHERE session_password IS NOT NULL \
                   AND session_owner = " + connection.escape(id);

        connection.query(sql, function(err, result) {
            connection.end();
            if(callback) callback(null, result[0]["COUNT(*)"]);
        });
    });
};


/* Pricing */
exports.pricing = function(callback) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT * FROM pricing";

        connection.query(sql, function(err, result) {
            connection.end();
            if(callback) callback(null, result);
        });
    });
};

exports.pricing_by_id = function(callback, id) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT * FROM users_pricing WHERE pricing_id = " + connection.escape(id);

        connection.query(sql, function(err, result) {
            connection.end();
            if(callback) callback(null, result);
        });
    });
};