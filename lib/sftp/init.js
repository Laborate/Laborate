var Connection = require('ssh2');

exports.authorize = function(credentials, callback) {
    var connection = new Connection();

    if(credentials.private_key) {
        connection.connect({
            host: credentials.host,
            username: credentials.username,
            passphrase: credentials.password || null,
            privateKey: credentials.private_key
        });
    } else {
        connection.connect({
            host: credentials.host,
            username: credentials.username,
            password: credentials.password
        });
    }

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
