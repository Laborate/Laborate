var mysql = require("./mysql");

exports.pricing_by_id = function(req, id) {
    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);
        var sql = "SELECT * FROM pricing WHERE pricing_id = " + connection.escape(id);

        connection.query(sql, function(err, result) {
            req.body.pricing = result[0];
            connection.end();
        });
    });
};