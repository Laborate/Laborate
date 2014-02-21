/* Modules: NPM */
var github = require('octonode');

module.exports = function(token, repo, branch, path, content, message, callback) {
    var client = github.client(token);
    async.waterfall([
        function(next) {
            client.get('repos/' + repo + '/git/refs/heads/' + branch, function (error, status, body) {
                next(error, body['object']['sha']);
            });
        },
        function(sha, next) {
            client.get('repos/' + repo + '/git/commits/' + sha, function (error, status, body) {
                next(error, sha, body['tree']['sha']);
            });
        },
        function(sha, tree, next) {
            client.post('repos/' + repo + '/git/trees', {
                "base_tree": tree,
                "tree": [{
                    "path": path,
                    "mode": "100644",
                    "type": "blob",
                    "content": content
                }]
            }, function (error, status, body) {
                next(error, sha, body['sha']);
            });
        },
        function(sha, new_sha, next) {
            client.post('repos/' + repo + '/git/commits', {
                "message": message,
                "parents": [sha],
                "tree": new_sha
            }, function (error, status, body) {
                next(error, body['sha']);
            });
        },
        function(commit_sha, next) {
            client.post('repos/' + repo + '/git/refs/heads/' + branch, {
                "sha": commit_sha,
                "force": true
            }, function (error, status, body) {
                next(error);
            });
        }
    ], function(errors) {
        if(callback) callback(errors);
    });
}
