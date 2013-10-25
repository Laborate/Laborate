module.exports = function(credentials, repo, branch, path, callback) {
    this.authorize(credentials, function(bitbucket) {
        var url = "/repositories/" + repo + "/src/" + branch + "/" + path;
        bitbucket.get(url, null, null, function(error, content) {
            console.log(url, error.status, content);
            if(callback) callback(error, content);
        });
    });
}
