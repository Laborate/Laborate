var mysql = require("../lib/mysql");

module.exports = function() {
    var response;

    mysql.pool.getConnection(function(err, connection) {
        var connection = mysql.config_connection(connection);

        connection.query("show tables", function(err, result) {
                connection.end();
                if(err) {
                    console.log("Either the Datbase Name, UserName or Password are incorrect. Fix in config.json");
                    response = false;
                } else {
                    response = true;
                }
            }
        );
    });
}