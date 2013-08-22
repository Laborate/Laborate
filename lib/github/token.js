/* Modules: NPM */
var github = require('octonode');

module.exports = function(code, callback) {
    github.auth.login(code, function (error, token) {
        if(callback) callback(error, token);
    });
}
