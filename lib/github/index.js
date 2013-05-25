var config = require('../../config');
var github = require('octonode');

exports.auth_url = github.auth.config({
  id: config.github.id,
  secret: config.github.secret
}).login(config.github.scope);

exports.get_token = function(token, callback) {
    github.auth.login(token, function (err, token) {
        if(callback) callback(token);
    });
}