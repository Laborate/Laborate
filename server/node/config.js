/* Requires */
var io = require('socket.io').listen(8000);
var mysql = require('mysql');
var queues = require('mysql-queues');

/* Configs */
//Socket IO Config
io.configure(function(){
    io.enable('browser client minification');  // send minified client
    io.enable('browser client etag');          // apply etag caching logic based on version number
    io.enable('browser client gzip');          // gzip the file
    io.set('log level', 1);                    // reduce logging
    io.set('transports', [ 'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
    io.set('log colors', true);
});

io.on('error', function(err) {
    console.log('Socket IO Error: ' + err.stack);
    require('socket.io').listen(8000);
    return false;
});

//MYSQL Config
var connection = mysql.createConnection({
    //socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock',
    user     : 'root',
    password : 'bjv0623',
    database : 'code',
});

connection.on('error', function(err) {
    console.log('MYSQL Error: ' + err.stack);
    connection = mysql.createConnection(connection.config);
    return false;
});

queues(connection);

//Node Error Handling
process.on('uncaughtException', function(err) {
  console.log("Uncaught Error: " + err);
  return false;
});


/* Exports */
exports.io = io;
exports.connection = connection;
