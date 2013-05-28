var config = require('../../config');
var aes = require('crypto');
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
    var client = github.client(token);
    client.get('user/subscriptions', function (error, status, body) {
        $.each(body, function(key, value) {
             body[key] = {
                 repo: value["url"].replace("https://api.github.com/repos/", ""),
                 private: value['private']
             }
        });
        if(callback) callback(error, body);
    });
}

exports.repo_contents = function(token, repo, path, callback) {
    var client = github.client(token);
    var url = 'repos/' + repo + '/contents/' + path;
    client.get(url, function (error, status, body) {
        if("type" in body) {
            body = new Buffer(body.content, body.encoding).toString('utf-8');
        } else {
            if(path) {
                body.push({
                   name: "",
                   type: "back",
                   path: path.substr(0, path.lastIndexOf('/'))
                });
            }
            $.each(body, function(key, value) {
                 body[key] = {
                     name: value['name'],
                     type: value["type"],
                     path: value['path']
                 }
            });
        }
        if(callback) callback(error, body);
    });
}