module.exports = function(server, credentials, callback) {
    this.authorize(server, credentials, function(bitbucket) {
        bitbucket.get('user/repositories/', null, null, function(error, repos) {
            if(!error) {
                try {
                    repos = $.map(repos, function(value) {
                        return {
                            user: value.owner,
                            repo: value.slug,
                            private: value.is_private,
                            branch: "master"
                        }
                    });

                    repos.sort(function (a, b) {
                        var a = a.user.toLowerCase() + "/" + a.repo.toLowerCase();
                        var b = b.user.toLowerCase() + "/" + b.repo.toLowerCase();
                        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
                    });
                } catch(e) {
                    console.log(e.stack);
                }
            }

            if(callback) callback(error, repos);
        });
    });
}
