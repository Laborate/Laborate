/* Modules: NPM */
var aes = require('crypto');
var $ = require('jquery');
var github = require('octonode');

/* Modules: Custom */
var config = require('../../config');

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
                user: value.owner.login,
                repo: value.name,
                private: value.private
            }
        });

        body.sort(function (a, b) {
            var a = a.user.toLowerCase() + "/" + a.repo.toLowerCase();
            var b = b.user.toLowerCase() + "/" + b.repo.toLowerCase();
            return ((a < b) ? -1 : ((a > b) ? 1 : 0));
        });

        if(callback) callback(error, body);
    });
}

exports.repo_contents = function(token, repo, path, callback) {
    var client = github.client(token);
    var url = 'repos/' + repo + '/contents/' + path;
    url = url.substring(0, url.length - 1);
    client.get(url, function (error, status, body) {
        if("type" in body) {
            body = new Buffer(body.content, body.encoding).toString('utf-8');
        } else {
            if(path) {
                path = (path.substr(-1) == '/') ? path.substr(0, path.length - 1) : path;
                path = path.substr(0, path.lastIndexOf('/'));

                body.push({
                   name: "",
                   type: "back",
                   path: path
                });
            }
            $.each(body, function(key, value) {
                 body[key] = {
                     name: value.name,
                     type: value.type,
                     path: value.path
                 }
            });

            body.sort(function (a, b) {
                var field = (a.type == b.type) ? "name" : "type";
                var a = a[field].toLowerCase();
                var b = b[field].toLowerCase();
                return ((a < b) ? -1 : ((a > b) ? 1 : 0));
            });
        }
        if(callback) callback(error, body);
    });
}