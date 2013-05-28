var config = require('../../config');
var $ = require('jquery');
var github = require('octonode');

exports.auth_url = github.auth.config({
  id: config.github.id,
  secret: config.github.secret
}).login(config.github.scope);

exports.get_token = function(code, callback) {
    github.auth.login(code, function (error, token) {
        if(callback) callback(error, token);
    });
}

exports.user_repos = function(token, callback) {
    var client = github.client(token).me();
    client.repos(function (error, repos) {
        $.each(repos, function(key, value) {
             repos[key] = {
                 repo: value["url"].replace("https://api.github.com/repos/", ""),
                 private: value['private']
             }
        });
        if(callback) callback(error, repos);
    });
}