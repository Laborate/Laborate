/* Modules: NPM */
var aes = require('crypto');
var $ = require('jquery');
var github = require('octonode');
var path_solver = require('path');

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
        if(!error) {
            try {
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
            } catch(e) {
                console.log(e.stack);
            }
        }

        if(callback) callback(error, body);
    });
}

exports.repo_contents = function(token, repo, path, callback) {
    var client = github.client(token);
    var url = 'repos/' + repo + '/contents/' + path;
    url = url.substring(0, url.length - 1);
    client.get(url, function (error, status, body) {
        if(!error) {
            try {
                if("type" in body) {
                    if(body.type == "file") {
                        body = new Buffer(body.content, body.encoding).toString('utf-8');
                    } else {
                        path = (path.substr(-1) == '/') ? path.substr(0, path.length - 1) : path;
                        path = path.substr(0, path.lastIndexOf('/'));
                        path = path_solver.normalize(path + "/" + body.target) + "/";
                        exports.repo_contents(token, repo, path, callback);
                        return;
                    }
                } else {
                    priority_level = {
                        "back": "1",
                        "dir": "2",
                        "symlink": "3",
                        "file": "4"
                    }

                    if(path) {
                        path = (path.substr(-1) == '/') ? path.substr(0, path.length - 1) : path;
                        path = path.substr(0, path.lastIndexOf('/'));

                        body.push({
                           name: "",
                           type: "back",
                           path: path,
                           level: priority_level["back"]
                        });
                    }

                    $.each(body, function(key, value) {
                        body[key] = {
                            name: value.name,
                            type: value.type,
                            path: value.path,
                            priority: priority_level[value.type]
                        }
                    });

                    body.sort(function (a, b) {
                        var field = (a.priority == b.priority) ? "name" : "priority";
                        var a = a[field].toLowerCase();
                        var b = b[field].toLowerCase();
                        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
                    });
                }
            } catch(e) {
                console.log(e.stack);
            }
        }

        if(callback) callback(error, body);
    });
}