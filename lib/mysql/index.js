/* Modules: NPM */
var mysql  = require('mysql');
var queues = require('mysql-queues');

/* Modules: Custom */
var config = require('../../config');

/* MYSQL: Configuration */
exports.create_connection = function() {
    var connection = mysql.createConnection({
        host     : config.mysql.host,
        user     : config.mysql.username,
        password : config.mysql.password,
        database : config.mysql.database,
    });

    function handleDisconnect(connection) {
      connection.on('error', function(err) {
        console.log('MYSQL Error: ' + err.stack);
        if (!err.fatal) {
          return;
        }

        if (err.code !== 'PROTOCOL_CONNECTION_LOST') {
          throw err;
        }

        console.log('Re-connecting lost connection: ' + err.stack);

        connection = mysql.createConnection(connection.config);
        handleDisconnect(connection);
        connection.connect();
      });
    }

    handleDisconnect(connection);
    queues(connection);
    return connection;
}