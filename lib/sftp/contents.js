var fs = require('fs');
var tmp = require('tmp');

module.exports = function(credentials, path, callback) {
    var _this = this;
    path = path || credentials.default;

    if(["", " ", ".", "./"].indexOf(path) != -1) {
        path = "./";
    } else {
        path = (path.substr(-1) == '/') ? path.substr(0, path.length - 1) : path;
    }

    _this.authorize(credentials, function(error, sftp) {
        if(!error && sftp) {
            sftp.stat(path, function(error, stat) {
                if(!error && stat) {
                    switch(_this.type(stat.mode.toString())) {
                        case "file":
                            file(_this, sftp, path, _this.finish(sftp, callback));
                            break;

                        case "symlink":
                        case "dir":
                            directory(_this, sftp, {
                                default: credentials.default,
                                path: path
                            }, _this.finish(sftp, callback));
                            break;

                        default:
                            _this.finish(sftp, callback)("Unknown file type");
                    }
                } else {
                    _this.finish(sftp, callback)(error);
                }
            });
        } else {
            _this.finish(sftp, callback)(error);
        }
    });
}

function file(_this, sftp, path, callback) {
    var name = path.split("/")[path.split("/").length-1];
    var extension = name.split(".")[name.split(".").length-1];

    if(["png", "gif", "jpg", "jpeg", "ico", "wbm"].indexOf(extension) > -1) {
        var type = "image";
        var encoding = "binary";
    } else {
        var type = "document";
        var encoding = "utf-8";
    }

    tmp.file(function(error, tmp_path) {
        if(!error && path) {
            sftp.fastGet(path, tmp_path, {}, function(error) {
                if(!error) {
                    fs.readFile(tmp_path, encoding, function read(error, data) {
                        if(!error) {
                            callback(null, {
                                type: type,
                                name: name,
                                extentsion: extension,
                                contents: data
                            });

                            fs.unlinkSync(tmp_path);
                        } else {
                            callback(error);
                        }
                    });
                } else {
                    callback(error);
                }
            });
        } else {
            callback(error);
        }
    });
}

function directory(_this, sftp, path_data, callback) {
    var path = path_data.path;
    path = (path.substr(-1) == '/') ? path : (path + "/");

    sftp.opendir(path, function(error, handle) {
        if(!error && handle) {
            sftp.readdir(handle, function(error, contents) {
                if(!error && contents){
                    callback(null, function() {
                        var priority_level = {
                            "back": "1",
                            "dir": "2",
                            "symlink": "3",
                            "file": "4"
                        }

                        return {
                            type: "directory",
                            contents: $.map(contents, function(item) {
                                var name = item.filename;
                                var type = _this.type(item.attrs.mode.toString());

                                if([".", ".."].indexOf(name) == -1) {
                                    return {
                                        name: name,
                                        type: type,
                                        path: path + name,
                                        size: item.attrs.size,
                                        priority: priority_level[type],
                                        extension: (name.split(".").length > 1) ? name.split(".")[name.split(".").length-1] : ""
                                    }
                                }
                            }).concat(function() {
                                var items = [];

                                if([path_data.default, "./"].indexOf(path) == -1) {
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

                                return items;
                            }()).sort(function (a, b) {
                                var field = (a.priority == b.priority) ? "name" : "priority";
                                var a = a[field].toLowerCase();
                                var b = b[field].toLowerCase();
                                return ((a < b) ? -1 : ((a > b) ? 1 : 0));

                            })
                        }
                    }());
                } else {
                    callback(error);
                }
            });
        } else {
            callback(error);
        }
    });
}
