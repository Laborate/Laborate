var mysql = require("./mysql");

/* User */
exports.users = function(next) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT * FROM users";

        connection.query(sql, function(err, result) {
            connection.end();
            if(next) next(result);
        });
    });
};

exports.user_by_id = function(next, id) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT * FROM users, users_pricing WHERE \
                   users.user_pricing = users_pricing.pricing_id \
                   AND user_id = " + connection.escape(id);

        connection.query(sql, function(err, result) {
            connection.end();
            if(next) next(result[0]);
        });
    });
};

exports.user_by_email = function(next, email) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT * FROM users, users_pricing WHERE \
                   users.user_pricing = users_pricing.pricing_id \
                   AND user_email = " + connection.escape(email);

        connection.query(sql, function(err, result) {
            connection.end();
            if(next) next(result);
        });
    });
};

exports.user_pass_sessions = function(next, id) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT COUNT(*) FROM sessions \
                   WHERE session_password IS NOT NULL \
                   AND session_owner = " + connection.escape(id);

        connection.query(sql, function(err, result) {
            connection.end();
            if(next) next(result[0]["COUNT(*)"]);
        });
    });
};


/* Pricing */
exports.pricing = function(next) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT * FROM pricing";

        connection.query(sql, function(err, result) {
            connection.end();
            if(next) next(result);
        });
    });
};

exports.pricing_by_id = function(next, id) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT * FROM users_pricing WHERE pricing_id = " + connection.escape(id);

        connection.query(sql, function(err, result) {
            connection.end();
            if(next) next(result);
        });
    });
};