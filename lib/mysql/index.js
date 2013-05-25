/* Modules: NPM */
var mysql  = require('mysql');
var queues = require('mysql-queues');

/* Modules: Custom */
var config = require('../../config');

/* MYSQL: Configuration */
var pool = mysql.createPool({
    user     : config.mysql.username,
    password : config.mysql.password,
    database : config.mysql.database,
});

exports.pool = pool;

exports.config_connection = function(connection) {
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

    /* MYSQL: Start Queues */
    queues(connection);

    return connection;
}