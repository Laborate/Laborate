module.exports = function(credentials, path, callback) {
    this.authorize(credentials, function(error, client, execute) {
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
