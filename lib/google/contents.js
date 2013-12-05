module.exports = function(server, credentials, path, callback) {
    console.log(credentials.access_token);
    this.authorize(server, credentials, function(error, client, execute) {
        if(!error) {
            if(!path) path = credentials.root;
            execute(client.files.list(path), function(error, results) {
                console.log(error, results);
                callback(error, results);
            });
        } else {
            callback(error);
        }
    });
}
