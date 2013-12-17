module.exports = function(server, credentials, repo, branch, path, callback) {
    this.authorize(server, credentials, function(bitbucket) {
        var url = "repositories/" + encodeURI(repo) + "/src/" + branch + "/" + path + " ";
        bitbucket.get(url, null, null, function(error, contents) {
            if(callback) callback(error, function() {
                if(!error) {
                    if(contents.path == "/") contents.path = "";

                    if("files" in contents) {
                        var priority_level = {
                            "back": "1",
                            "dir": "2",
                            "file": "4"
                        }

                        return {
                            type: "directory",
                            contents: $.map(contents.files, function(item) {
                                var name = item.path.replace(contents.path, "");
                                return {
                                    name: name,
                                    type: "file",
                                    path: item.path,
                                    size: item.size,
                                    priority: priority_level["file"],
                                    extension: (name.split(".").length > 1) ? name.split(".")[name.split(".").length-1] : ""
                                }
                            }).concat(function() {
                                var items = [];

                                if(path) {
                                    path = (path.substr(-1) == '/') ? path.substr(0, path.length - 1) : path;
                                    path = path.substr(0, path.lastIndexOf('/'));

                                    items.push({
                                       name: "",
                                       type: "back",
                                       path: path,
                                       priority: priority_level["back"],
                                       extension: ""
                                    });
                                }

                                $.each(contents.directories, function(key, item) {
                                    items.push({
                                        name: item,
                                        type: "dir",
                                        size: null,
                                        path: contents.path + item + "/",
                                        priority: priority_level["dir"],
                                        extension: ""
                                    });
                                });

                                return items;
                            }()).sort(function (a, b) {
                                var field = (a.priority == b.priority) ? "name" : "priority";
                                var a = a[field].toLowerCase();
                                var b = b[field].toLowerCase();
                                return ((a < b) ? -1 : ((a > b) ? 1 : 0));

                            })
                        }
                    } else if("data" in contents) {
                        var name = contents.path.split("/")[contents.path.split("/").length-1];
                        var extension = name.split(".")[name.split(".").length-1];
                        if(["png", "gif", "jpg", "jpeg", "ico", "wbm"].indexOf(extension) > -1) {
                            return {
                                type: "image",
                                name: name,
                                extentsion: extension,
                                contents: new Buffer(contents.data, contents.encoding).toString("binary")
                            }
                        } else {
                            return {
                                type: "document",
                                name: name,
                                extentsion: extension,
                                contents: contents.data
                            }
                        }
                    }
                }
            }());
        });
    });
}
