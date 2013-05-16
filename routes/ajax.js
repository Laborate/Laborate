/* Modules: NPM */
var crypto = require('crypto');
var async = require("async");

/* Modules: Custom */
var aes   = require('../lib/aes');
var mysql_lib = require('../lib/users_mysql_lib');

/* Module Exports: Account - Github */
exports.account_github = function(req, res) {
    async.parallel({
        github_listings: function(callback) {
            mysql_lib.user_pass_sessions_count(callback, req.session.user.id);
        }
    }, function(error, results){
        if(error) {
            res.json({
                success: false,
                error_code: error
            });
        } else {
            res.json({
                success: true,
                repos: [
                    { "private": true, "repo_name": "fun", "user": "Brian" }
                ]
            });
        }
    });
};