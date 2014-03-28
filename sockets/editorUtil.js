var _this = exports;
var async = require('async');

/* Authentication */
exports.accessCheck = function(req, callback) {
    lib.models_init(null, function(db, models) {
        models.documents.roles.find({
            user_id: req.session.user.id,
            document_pub_id: _this.room(req),
            access: true
        }, function(error, roles) {
            if(!error && !roles.empty) {
                _this.clientData(req, {
                    isEmbed: false,
                    document: roles[0].document,
                    permission: roles[0].permission
                }, callback);
            } else {
                callback("exists");
            }
        });
    });
}

exports.accessCheckEmbed = function(req, callback) {
    lib.models_init(null, function(db, models) {
        async.series({
            document: function(next) {
                models.documents.find({
                    pub_id: _this.room(req),
                    private: false
                }, function(error, documents) {
                    if(!error && !documents.empty) {
                        next(null, documents[0]);
                    } else {
                        next("exists");
                    }
                });
            },
            permission: function(next) {
                models.documents.permissions.find({
                    owner: false,
                    readonly: true,
                    access: true
                }, function(error, permissions) {
                    if(!error && !permissions.empty) {
                        next(null, permissions[0]);
                    } else {
                        next("exists");
                    }
                });
            }
        }, function(errors, data) {
            if(!errors && data) {
                _this.clientData(req, {
                    isEmbed: true,
                    document: data.document,
                    permission: data.permission
                }, callback);
            } else {
                callback(errors[0]);
            }
        });
    });
}


/* Client Data: Redis & Models */
exports.clientData = function(req, role, callback) {
    var room = _this.room(req, true);
    var readonly;

    _this.getRedis(room, function(error, document) {
        if(!error) {
            if(!document) {
                document = {
                    id: role.document.id,
                    breakpoints: role.document.breakpoints,
                    changes: [],
                    users: {}
                }
            }

            if(!role.isEmbed) {
                document.users[req.io.socket.id] = {
                    id: req.session.user.id,
                    pub_id: req.session.user.pub_id,
                    name: req.session.user.name,
                    socket: req.io.socket.id
                }
            }

            lib.jsdom.editor(role.document.content, document.changes, function(content) {
                callback(false, {
                    success: true,
                    name: role.document.name,
                    content: content,
                    breakpoints: $.map(document.breakpoints, function(value) {
                        return { "line": value };
                    }),
                    permission: {
                        id: role.permission.id,
                        name: role.permission.name,
                        readonly: function(permission) {
                            if(permission.owner) {
                                return false;
                            } else if(document.readonly) {
                                return true;
                            } else if(permission.readonly) {
                                return true;
                            } else {
                                return false;
                            }
                        }(role.permission)
                    }
                });

                document.changes = [];
                _this.setRedis(room, document);
                req.io.join(room);

                if(role.isEmbed) {
                    req.io.join(_this.room(req, true));
                }
            });
        } else {
            return callback("problems");
        }
    });
}

/* Save Document */
exports.saveDocument = function(req, callback) {
    var room = _this.room(req, true);

    _this.getRedis(room, function(error, reply) {
        lib.models_init(null, function(db, models) {
            models.documents.roles.find({
                user_id: req.session.user.id,
                document_id: reply.id,
                access: true
            }, function(error, roles) {
                if(!error && !roles.empty) {
                    var document = roles[0].document;
                    lib.jsdom.editor(document.content, reply.changes, function(content) {
                        document.save({
                            content: (content != "") ? content.split("\n") : [],
                            breakpoints: reply.breakpoints
                        });

                        reply.changes = [];
                        _this.setRedis(room, reply);
                        if(callback) callback();
                    });
                }
            });
        });
    });
}

/* Broadcast */
exports.broadcast = function(req, type, socket, callback) {
    var room = _this.room(req, true);
    var channel, message, data;

    switch(type) {
        case "laborators":
            channel = 'editorExtras';
            message = {
                laborators: true
            }
            break;

        case "document deleted":
            channel = 'editorExtras';
            message = {
                docDelete: true
            }
            break;

        case "chatroom joined":
            channel = "editorChatRoom";
            message = {
                message: req.session.user.screen_name + " joined the document",
                isStatus: true
            }
            break;

        case "chatroom left":
            channel = "editorChatRoom";
            message = {
                message: req.session.user.screen_name + " left the document",
                isStatus: true
            }
            break;
    }

    if(room && message) {
        data = $.extend(true, {
            success: true
        }, message);

        if(socket) {
            socket.emit(channel, data);
        } else {
            req.io.room(room).broadcast(channel, data);
        }
    }
}

/* Error Handler */
exports.error = function(req, type) {
    var data,
        message,
        disconnect = false,
        manager = req.io.socket.manager;

    switch(type) {
        case "exists":
            message = {
                error_message: "Document Does Not Exist",
                redirect_url: "/documents/"
            }
            break;

        case "problems":
            message = {
                error_message: "Sorry, We Are Experience Difficulties",
                redirect_url: "/documents/"
            }
            break;

        case "kickout":
            disconnect = true;
            message = {
                error_message: "Login Is Required",
                redirect_url: "/logout/"
            }
            break;
    }

    if(message) {
        data = $.extend(true, {
            success: false
        }, message);

        req.io.respond(data);
        manager.sockets.sockets[req.io.socket.id].emit("editorError", data);

        if(disconnect) {
            manager.onClientDisconnect(req.io.socket.id, "forced");
        }
    }
}

/* Get Room */
exports.room = function(req, socket, embed) {
    var room = /.*\/editor\/(.*?)\/.*/.exec(req.headers.referer);

    if(room) {
        room = room[1];

        if(socket) {
            if(embed) {
                return "editor:embed:" + room;
            } else {
                return "editor:" + room;
            }
        } else {
            return room;
        }

    } else {
        return null;
    }
}

/* Get Room */
exports.isEmbed = function(req) {
    return !!(/.*\/editor\/.*?\/embed\/.*/.exec(req.headers.referer));

}

/* Get User Sockets */
exports.userSockets = function(req, pub_id, callback) {
    _this.getRedis(_this.room(req, true), function(error, document) {
        if(document) {
            callback($.map(document.users, function(user) {
                if(pub_id == user.pub_id) {
                    return user.socket;
                }
            }));
        } else {
            callback([]);
        }
    });
}

/* Get Users */
exports.users = function(req, callback) {
    var room = _this.room(req, true);
    _this.getRedis(room, function(error, document) {
        var users = Object.keys(document.users);
        var sockets = req.io.socket.manager.sockets.sockets;

        $.each(users, function(index, user) {
            if(!(user in sockets)) {
                delete document.users[user];
            }

            if(users.end(index)) {
                _this.setRedis(room, document);
                callback(document.users);
            }
        });
    });
}

/* Remove User */
exports.removeUser = function(req) {
    var room = _this.room(req, true);
    _this.getRedis(room, function(error, document) {
        delete document.users[req.io.socket.id];
        _this.setRedis(room, document);
    });
}

/* Get From Redis */
exports.getRedis = function(room, callback) {
    lib.redis.get(room, function(error, response) {
        callback(error, JSON.parse(response));
    });
}

/* Save To Redis */
exports.setRedis = function(room, data) {
    lib.redis.set(room, JSON.stringify(data));
}

/* Remove From Redis */
exports.removeRedis = function(room) {
    lib.redis.del(room);
}
