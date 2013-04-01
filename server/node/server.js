/* Requires */
var base = require('./config.js');
var utils = require('./utils.js');
var connection = base.connection;

/* Socket Events */
base.io.sockets.on( 'connection', function (socket) {
    socket.on('join', function(data) {
        utils.join_session(socket, data[0], data[1]);
    });
});