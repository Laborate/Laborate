var $ = require("jquery");
var mysql = require("../");

/* All User Pricing */
exports.user_pricing = function(callback) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT * FROM pricing";

        connection.query(sql, function(err, result) {
            connection.end();
            if(callback) callback(null, result);
        });
    });
};

/* Listing By Identifier */
exports.user_pricing_by_id = function(callback, id) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT * FROM users_pricing WHERE pricing_id = " + connection.escape(id);

        connection.query(sql, function(err, result) {
            connection.end();
            if(callback) callback(null, result);
        });
    });
};