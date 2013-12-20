exports.roomUsers = new Array();

exports.users = function(user, room) {
    if(room in exports.roomUsers) {
        if(user in exports.roomUsers[room]) {
            var copyUsers = Object.keys(exports.roomUsers[room]);
            copyUsers.splice(copyUsers.indexOf(user), 1);
            return copyUsers;
        } else {
            return [];
        }
    } else {
        return [];
    }
}

exports.accessCheck = function(user, room, token, callback) {
    lib.models_init(null, function(db, models) {
        models.documents.roles.find({
            user_id: user,
            document_pub_id: room[0]
        }, function(error, documents) {
            if(!error && documents.length == 1) {
                var document = documents[0].document;
                if((!document.password || token == document.password)) {
                    callback({
                        success: true,
                        document: document,
                        permission: documents[0].permission
                    });
                } else {
                    callback({
                        success: false,
                        error_message: "Invalid Credentials",
                        redirect_url: "/documents/"
                    });
                }
            } else {
                callback({
                    success: false,
                    error_message: "Document Does Not Exist",
                    redirect_url: "/documents/"
                });
            }
        });
    }, true);
}

exports.clientData = function(room, document_role, callback) {
    var redis = lib.redis();
    var document = document_role.document;
    var permission = document_role.permission;

    redis.get(room, function(error, reply) {
        if(!error && reply) {
            reply = JSON.parse(reply);
            document.breakpoints = reply.breakpoints;
            document.changes = reply.changes;
        } else {
            document.changes = [];
            redis.set(room, JSON.stringify({
                id: document.id,
                breakpoints: document.breakpoints,
                changes: [],
                users: []
            }));
        }

        callback({
            success: true,
            name: document.name,
            content: (document.content) ? document.content.join("\n") : "",
            breakpoints: ((document.breakpoints) ? $.map(document.breakpoints, function(value) {
                return {"line": value};
            }) : []),
            changes: document.changes,
            access: permission.name
        });
    });
}

exports.addUser = function(req, user_id, user_name, room) {
    req.io.join(room);
    req.io.room(room).broadcast('editorChatRoom', {
        message: user_name + " joined the document",
        isStatus: true
    });

    if(!(room in exports.roomUsers)) {
        exports.roomUsers[room] = new Array();
    }

    exports.roomUsers[room][user_id] = {
        "socket": req.io.socket.id
    }
}

exports.removeUser = function(req, user, room) {
    var redis = lib.redis();

    req.io.leave(room);
    req.io.socket.disconnect();

    if(room in exports.roomUsers) {
        if(user in exports.roomUsers[room]) {
            clearInterval(exports.roomUsers[room][user]["update"]);
            delete exports.roomUsers[room][user];

            if(Object.keys(exports.roomUsers[room]).length == 0) {
                delete exports.roomUsers[room];
                lib.models_init(null, function(db, models) {
                    models.documents.roles.find({
                        user_id: req.session.user.id,
                        document_pub_id: exports.room(req)
                    }, function(error, documents) {
                        if(!error && documents.length == 1) {
                            var document = documents[0].document;
                            redis.get(room, function(error, reply) {
                                reply = JSON.parse(reply);
                                if(reply.changes) {
                                    lib.jsdom.editor(document.content, reply.changes, function(content) {
                                        document.save({
                                            content: content.split("\n"),
                                            breakpoints: reply.breakpoints
                                        });
                                        redis.del(room);
                                    });
                                }
                            });
                        } else  {
                            redis.del(room);
                        }
                    });
                }, true);
            }
        }
    }
}

exports.userSocket = function(user, room) {
    if(room in exports.roomUsers) {
        if(user in exports.roomUsers[room]) {
            return exports.roomUsers[room][user]["socket"];
        } else {
            return false;
        }
    } else {
        return false;
    }
}

exports.room = function(req) {
    return req.headers.referer.split("/").slice(-2, -1);
}

exports.socketRoom = function(req) {
    return "editor" + exports.room(req);
}

exports.inRoom = function(reconnect, user, room) {
    if(!reconnect) {
        if(room in exports.roomUsers) {
            if(user in exports.roomUsers[room]) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

exports.kickOut = function(req, response) {
    req.io.respond(((!response) ? {
        success: false,
        error_message: "Log In Required",
        redirect_url: true
    } : response));

    //Force Socket Disconnect
    req.io.socket.manager.onClientDisconnect(req.io.socket.id, "forced");
}
