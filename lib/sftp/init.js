var _this = exports;
var Connection = require('ssh2');

exports.authorize = function(credentials, callback) {
    var connection = new Connection();

    connection.connect(function() {
        if(credentials.public_key) {
            return {
                host: credentials.host,
                username: credentials.username,
                passphrase: credentials.password || null,
                publicKey: credentials.public_key,
                tryKeyboard: true
            };
        } else {
            return {
                host: credentials.host,
                username: credentials.username,
                password: credentials.password,
                tryKeyboard: true
            };
        }
    }());

    connection.on('ready', function() {
        connection.sftp(callback);
    });

    connection.on('error', function(error) {
        callback(error);
    });
}

exports.finish = function(sftp, callback) {
    return function(error, data) {
        if(sftp) {
            sftp.end();
        }

        callback(error, data);
    }
}
