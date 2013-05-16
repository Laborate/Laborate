var mysql = require("./mysql");

/* User */
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