var mysql = require("../");

/* All User Pricing */
exports.user_pricing = function(callback) {
    var connection = mysql.config_connection(connection);
    var sql = "SELECT * FROM code_user_pricing";

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};

/* Listing By Identifier */
exports.user_pricing_by_id = function(callback, id) {
    var connection = mysql.config_connection(connection);
    var sql = "SELECT * FROM code_user_pricing WHERE pricing_id = " + connection.escape(id);

    connection.query(sql, function(error, result) {
        connection.end();
        if(callback) callback(error, result);
    });
};