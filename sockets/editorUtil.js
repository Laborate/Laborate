var _this = exports;

/* Authentication */
exports.accessCheck = function(req, callback) {
    lib.models_init(null, function(db, models) {
        models.documents.roles.find({
            user_id: req.session.user.id,
            document_pub_id: _this.room(req),
            access: true
        }, function(error, documents) {
            if(!error && !documents.empty) {
                _this.clientData(req, {
                    document: documents[0].document,
                    permission: documents[0].permission
                }, callback);
            } else {
                callback("exists");
            }
        });
    });
}

/* Client Data: Redis & Models */
exports.clientData = function(req, data, callback) {
    var room = _this.room(req, true);
    var readonly;

    _this.getRedis(room, function(error, document) {
        if(!error) {
            if(document) {
                if(req.session.user.pub_id in document.users) {
                    return callback("already editing");
                } else {
                    document.users[req.session.user.pub_id] = {
                        id: req.session.user.id,
                        pub_id: req.session.user.pub_id,
                        name: req.session.user.name
                    }
                }
            } else {
                document = {
                    id: data.document.id,
                    breakpoints: data.document.breakpoints,
                    changes: [],
                    users: {}
                }

                document.users[req.session.user.pub_id] = {
                    id: req.session.user.id,
                    pub_id: req.session.user.pub_id,
                    name: req.session.user.name,
                    socket: req.io.socket.id
                }
            }

            lib.jsdom.editor(data.document.content, document.changes, function(content) {
                callback(false, {
                    success: true,
                    name: data.document.name,
                    content: content,
                    breakpoints: $.map(breakpoints, function(value) {
                        return { "line": value };
                    }),
                    permission: {
                        id: data.permission.id,
                        name: data.permission.name,
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
                        }(data.permission)
                    }
                });

                _this.saveRedis(room, document);
            });
        } else {
            return callback("problems");
        }
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
                "docDelete": true
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

/* Get User Socket */
exports.userSocket = function(req, user, callback) {
    _this.getRedis(_this.room(req, true), function(error, document) {
        callback(document.users[user]);
    });
}

/* Remove User */
exports.removeUser = function(req, user) {
    var room = _this.room(req, true);

    _this.getRedis(room, function(error, document) {
        delete document.users[user];
        _this.saveRedis(room, document);
    });
}

/* Get From Redis */
exports.getRedis = function(room, callback) {
    lib.redis.get(room, function(error, response) {
        callback(error, JSON.parse(response));
    });
}

/* Save To Redis */
exports.saveRedis = function(room, data) {
    lib.redis.set(room, JSON.stringify(data));
}
