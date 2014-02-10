/* Modules: NPM */
var github = require('octonode');

module.exports = function(token, callback) {
    var client = github.client(token);
    client.get('user/subscriptions', function (error, status, body) {
        if(!error) {
            try {
                $.each(body, function(key, value) {
                    body[key] = {
                        user: value.owner.login,
                        repo: value.name,
                        private: value.private,
                        branch: value.default_branch
                    }
                });

                body.sort(function (a, b) {
                    var a = a.user.toLowerCase() + "/" + a.repo.toLowerCase();
                    var b = b.user.toLowerCase() + "/" + b.repo.toLowerCase();
                    return ((a < b) ? -1 : ((a > b) ? 1 : 0));
                });
            } catch(e) {
                callback(error);
            }
        }

        callback(error, body);
    });
}
