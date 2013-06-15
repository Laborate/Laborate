/* Modules: NPM */
var aes = require('crypto');
var $ = require('jquery');
var github = require('octonode');
var path_solver = require('path');

exports.auth_url = github.auth.config({
  id: config.github.id,
  secret: config.github.secret
}).login(config.github.scope);

exports.get_token = function(code, callback) {
    github.auth.login(code, function (error, token) {
        if(callback) callback(error, token);
    });
}

exports.repos = function(token, callback) {
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

exports.contents = function(token, repo, path, callback) {
    var client = github.client(token);
    var url = 'repos/' + repo + '/contents/' + path;
    url = url.substring(0, url.length - 1);
    client.get(url, function (error, status, body) {
        if(!error) {
            try {
                if("type" in body) {
                    if(body.type == "file") {
                        var extension = body.name.split(".")[body.name.split(".").length-1];
                        if(["png", "gif", "jpg", "jpeg", "ico", "wbm"].indexOf(extension) > -1) {
                            var info = {"type": "image", "decode": "binary"};
                        } else {
                            var info = {type: "document", decode: "ascii"};
                        }

                        body = {
                            type: info.type,
                            name: body.name,
                            extentsion: extension,
                            contents: new Buffer(body.content, body.encoding).toString(info.decode)
                        }

                        if(callback) callback(error, body);
                    } else {
                        path = (path.substr(-1) == '/') ? path.substr(0, path.length - 1) : path;
                        path = path.substr(0, path.lastIndexOf('/'));
                        path = path_solver.normalize(path + "/" + body.target) + "/";
                        exports.contents(token, repo, path, callback);
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
                           priority: priority_level["back"],
                           extension: ""
                        });
                    }

                    $.each(body, function(key, value) {
                        body[key] = {
                            name: value.name,
                            type: value.type,
                            path: value.path,
                            priority: priority_level[value.type],
                            extension: (value.name.split(".").length > 1) ? value.name.split(".")[value.name.split(".").length-1] : ""
                        }
                    });

                    body.sort(function (a, b) {
                        var field = (a.priority == b.priority) ? "name" : "priority";
                        var a = a[field].toLowerCase();
                        var b = b[field].toLowerCase();
                        return ((a < b) ? -1 : ((a > b) ? 1 : 0));
                    });

                    if(callback) callback(error, {type: "directory", contents: body});
                }
            } catch(error) {
                console.log(error.stack);
                if(callback) callback(error);
            }
        } else {
            if(callback) callback(error);
        }
    });
}
