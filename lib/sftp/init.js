var Connection = require('ssh2');

exports.authorize = function(credentials, callback) {
    var connection = new Connection();
    connection.connect(credentials);
    connection.on('ready', function() {
        connection.sftp(callback);
    });
}

exports.finish = function(sftp, callback) {
    return function(error, data) {
        sftp.end();
        callback(error, data);
    }
}
