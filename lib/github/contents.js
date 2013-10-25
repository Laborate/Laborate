/* Modules: NPM */
var github = require('octonode');
var path_solver = require('path');

module.exports = function(token, repo, path, callback) {
    var client = github.client(token);
    var url = 'repos/' + repo + '/contents/' + path;
    url = url.substring(0, url.length - 1);
    client.get(url, function(error, status, body) {
        if(!error) {
            try {
                if("type" in body) {
                    if(body.type == "file") {
                        var extension = body.name.split(".")[body.name.split(".").length-1];
                        if(["png", "gif", "jpg", "jpeg", "ico", "wbm"].indexOf(extension) > -1) {
                            client.get('repos/' + repo + '/git/blobs/' + body.sha, function(error, status, image) {
                                if(callback) callback(error, {
                                    type: "image",
                                    name: body.name,
                                    extentsion: extension,
                                    contents: new Buffer(image.content, image.encoding).toString("binary")
                                });
                            });
                        } else {
                            if(callback) callback(error, {
                                type: "document",
                                name: body.name,
                                extentsion: extension,
                                contents: new Buffer(body.content, body.encoding).toString("ascii")
                            });
                        }
                    } else {
                        path = (path.substr(-1) == '/') ? path.substr(0, path.length - 1) : path;
                        path = path.substr(0, path.lastIndexOf('/'));
                        path = path_solver.normalize(path + "/" + body.target) + "/";
                        module.exports(token, repo, path, callback);
                        return;
                    }
                } else {
                    priority_level = {
                        "back": "1",
                        "dir": "2",
                        "symlink": "3",
                        "file": "4"
                    }

                    if(!body["message"]) {
                        if(callback) callback(error, {
                            type: "directory",
                            contents: $.map(body, function(value) {
                                return {
                                    name: value.name,
                                    type: value.type,
                                    path: value.path,
                                    size: value.size,
                                    priority: priority_level[value.type],
                                    extension: (value.name.split(".").length > 1) ? value.name.split(".")[value.name.split(".").length-1] : ""
                                }
                            }).concat(function() {
                                if(path) {
                                    path = (path.substr(-1) == '/') ? path.substr(0, path.length - 1) : path;
                                    path = path.substr(0, path.lastIndexOf('/'));

                                    return {
                                       name: "",
                                       type: "back",
                                       path: path,
                                       priority: priority_level["back"],
                                       extension: ""
                                    };
                                }
                            }()).sort(function (a, b) {
                                var field = (a.priority == b.priority) ? "name" : "priority";
                                var a = a[field].toLowerCase();
                                var b = b[field].toLowerCase();
                                return ((a < b) ? -1 : ((a > b) ? 1 : 0));
                            })
                        });
                    } else {
                        if(callback) callback(body, null);
                    }
                }
            } catch(error) {
                if(callback) callback(error);
            }
        } else {
            if(callback) callback(error);
        }
    });
}
