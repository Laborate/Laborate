/* Modules: NPM */
var mysql      = require('mysql');
var queues     = require('mysql-queues');

/* Modules: Custom */
var config = require('../config');

/* MYSQL: Configuration */
var connection = mysql.createConnection({
    user     : config.mysql.username,
    password : config.mysql.password,
    database : config.mysql.database,
});

/* MYSQL: Error Handling */
connection.on('error', function(err) {
    console.log('MYSQL Error: ' + err.stack);
    module.exports.connection = mysql.createConnection(connection.config);
    return false;
});

/* MYSQL: Start Queues */
queues(connection);

/* Make MYSQL Global */
module.exports = connection;