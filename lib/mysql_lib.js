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
        var sql = "SELECT * FROM users WHERE user_id = " + connection.escape(id);

        connection.query(sql, function(err, result) {
            connection.end();
            if(next) next(result[0]);
        });
    });
};

exports.user_by_email = function(next, email) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT * FROM users WHERE user_email = " + connection.escape(email);

        connection.query(sql, function(err, result) {
            connection.end();
            if(next) next(result);
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
        var sql = "SELECT * FROM pricing WHERE pricing_id = " + connection.escape(id);

        connection.query(sql, function(err, result) {
            connection.end();
            if(next) next(result);
        });
    });
};