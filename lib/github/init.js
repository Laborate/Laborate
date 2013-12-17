/* Modules: NPM */
var github = require('octonode');

exports.url = github.auth.config({
    id: config.github.id,
    secret: config.github.secret
}).login(config.github.scope);

exports.token = function(code, callback) {
    github.auth.login(code, function (error, token) {
        if(callback) callback(error, token);
    });
}
