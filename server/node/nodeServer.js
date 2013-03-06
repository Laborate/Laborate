var io = require('socket.io').listen(8000);
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

process.on('uncaughtException', function(err) {
  console.log("Uncaught Error: " + err);
  return false;
});

var mysql = require('mysql');
var connection = mysql.createConnection({
    socketPath : '/Applications/MAMP/tmp/mysql/mysql.sock',
    user     : 'root',
    password : 'bjv0623',
    database : 'code',
});

connection.on('error', function(err) {
    console.log('MYSQL Error: ' + err.stack);
    connection = mysql.createConnection(connection.config);
    return false;
});

var queues = require('mysql-queues');
queues(connection);

io.sockets.on( 'connection', function (socket) {

    socket.on('join', function (new_id) {
        socket.get('session_id', function(err, old_id) {
          if (old_id) {
            socket.leave(old_id);
            console.log('info:', "left document: " + old_id);
          }
          socket.set('session_id', new_id, function() {
            socket.join(new_id);
            console.log('info:', "joined document: " + new_id);
            console.log('info:', "pulled document code: " + new_id);
            connection.query('SELECT * FROM sessions WHERE sessions.session_id = ?', [new_id + ""],
                function(err, pull_results) {
                    if(!err) {
                        socket.set('session_document', JSON.parse(pull_results[0]['session_document']));
                    }
                }
            );
          });
        });
    })

    socket.on('editor', function (data) {
        socket.get('session_id', function(err, session_id) {
            if (err) { console.log('error', err); }
            else if (session_id) {
                socket.broadcast.to(session_id).emit( 'editor' , data );
                if(data['line'] != undefined) {
                    socket.get('session_document', function(err, document) {
                        try {
                            if(data['code'] != "") {
                                document[parseInt(data['line'])] = data['code'];
                            } else {
                                document[parseInt(data['line'])] = "";
                            }
                            connection.query("UPDATE sessions SET session_document=? WHERE session_id = ?", [JSON.stringify(document), session_id + ""]);
                            socket.set('session_document', document);
                        } catch (TypeError) {
                            console.log("Document: " + document)
                            socket.to(session_id).emit( 'editor' , {"extras": {"passChange": "true"}} );
                            console.log("Document: " + session_id + " failed to save to database");
                        }
                    });
                }
            }
        });
    });

    socket.on('users', function (data) {
        socket.get('session_id', function(err, session_id) {
            if (err) { console.log('error', err); }
            else if (session_id) {
                socket.broadcast.to(session_id).emit( 'users' , data );
            }
        });
    });

    socket.on('cursors', function (data) {
        socket.get('session_id', function(err, session_id) {
            if (err) { console.log('error', err); }
            else if (session_id) {
                socket.broadcast.to(session_id).emit( 'cursors' , data );
            }
        });
    });

    socket.on('chatRoom', function (data) {
        socket.get('session_id', function(err, session_id) {
            if (err) { console.log('error', err); }
            else if (session_id) {
                socket.broadcast.to(session_id).emit( 'chatRoom' , data );
                if(data["isLeave"]) {
                    socket.leave(session_id);
                    socket.set('session_id', null);
                    console.log('info:', "left document: " + session_id);
                }
            }
        });
    });

});