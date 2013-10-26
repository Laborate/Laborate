module.exports = function(credentials, path, callback) {
    this.authorize(credentials, function(error, client, execute) {
        if(!error) {
            execute(client.files.list(), function(error, results) {
                console.log(error, results)
            });
        } else {
            //callback(error);
        }
    });
}
