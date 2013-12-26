var connections = { redis: lib.redis() };
var editorUtil = require("./editorUtil");
lib.models_init(connections);

/* Route Functions */
exports.join = function(req) {
    if(req.session.user) {
        editorUtil.accessCheck(req.session.user.id, editorUtil.room(req), function(access_object) {
            if(access_object.success) {
                if(!editorUtil.inRoom(req.data, req.session.user.pub_id, editorUtil.socketRoom(req))) {
                    editorUtil.clientData(editorUtil.socketRoom(req), access_object, function(data) {
                        editorUtil.addUser(
                            req,
                            req.session.user.pub_id,
                            req.session.user.screen_name,
                            editorUtil.socketRoom(req)
                        );
                        req.io.respond(data);

                        req.io.room(editorUtil.socketRoom(req)).broadcast('editorExtras', {
                            laborators: true
                        });
                    });
                } else {
                    req.io.respond({
                        success: false,
                        error_message: "You Are Already Editing This Document"
                    });
                }
            } else {
                editorUtil.kickOut(req);
            }
        });
    } else {
        editorUtil.kickOut(req);
    }
}

exports.disconnectAll = function(req, user) {
    user = user || req.session.user.pub_id;

    var socket = editorUtil.userSocket(user, editorUtil.socketRoom(req));
    if(socket in req.io.socket.manager.sockets.sockets) {
        req.io.socket.manager.sockets.sockets[socket].emit('editorExtras', { "docDelete": true });
    }
    req.io.respond({ success: true });
    req.io.socket.manager.onClientDisconnect(socket, "forced");
    exports.leave(req, true);

    req.io.room(editorUtil.socketRoom(req)).broadcast('editorExtras', {
        laborators: true
    });
}

exports.leave = function(req, override) {
    if(req.session.user) {
        var socket = editorUtil.userSocket(req.session.user.pub_id, editorUtil.socketRoom(req));
        //Only Non-forced Disconnects
        if((req.data == "booted" && socket == req.io.socket.id) || override == true) {
            req.io.room(editorUtil.socketRoom(req)).broadcast('editorChatRoom', {
                message: req.session.user.screen_name + " left the document",
                isStatus: true
            });

            editorUtil.save(req, function(success) {
                if(success) {
                    editorUtil.removeUser(req);
                }
            });
        }
    } else {
        editorUtil.kickOut(req);
    }

    req.io.room(editorUtil.socketRoom(req)).broadcast('editorExtras', {
        laborators: true
    });
}

exports.chatRoom = function(req) {
    if(req.session.user) {
        req.data.from = req.session.user.pub_id;
        req.data.gravatar = req.session.user.gravatar;
        req.io.room(editorUtil.socketRoom(req)).broadcast('editorChatRoom', req.data);
    } else {
        editorUtil.kickOut(req);
    }
}

exports.document = function(req) {
    if(req.session.user) {
        req.data.from = req.session.user.pub_id;
        req.data.gravatar = req.session.user.gravatar;
        req.io.room(editorUtil.socketRoom(req)).broadcast('editorDocument', req.data);

         connections.redis.get(editorUtil.socketRoom(req), function(error, reply) {
            reply = JSON.parse(reply);
            reply.changes.push(req.data["changes"]);
             connections.redis.set(editorUtil.socketRoom(req), JSON.stringify(reply));
        });
    }
}

exports.cursors = function(req) {
    if(req.session.user) {
        req.data.from = req.session.user.pub_id;
        req.data.gravatar = req.session.user.gravatar;
        req.io.room(editorUtil.socketRoom(req)).broadcast('editorCursors', req.data);
    } else {
        editorUtil.kickOut(req);
    }
}

exports.extras = function(req) {
    //Methods
    this.breakpoints = function(changes, breakpoints, callback) {
        $.each(changes, function(index, value) {
            if(value.remove) {
                if(breakpoints.indexOf(value.line) > -1) {
                    breakpoints.splice(breakpoints.indexOf(value.line), 1);
                }
            } else {
                breakpoints.push(value.line);
            }
        });

        callback(breakpoints);
    }

    this.get = function(callback) {
         connections.redis.get(editorUtil.socketRoom(req), function(error, reply) {
            callback(JSON.parse(reply));
        });
    }

    this.save = function(data) {
         connections.redis.set(editorUtil.socketRoom(req), JSON.stringify(data));
    }

    //Logic
    if(req.session.user) {
        req.data.from = req.session.user.pub_id;
        req.data.gravatar = req.session.user.gravatar;
        req.io.room(editorUtil.socketRoom(req)).broadcast('editorExtras', req.data);

        if("breakpoint" in req.data) {
            this.get(function(reply) {
                this.breakpoints(req.data.breakpoint, reply.breakpoints, function(breakpoints) {
                    reply.breakpoints = breakpoints;
                });
                this.save(reply);
            });
        }
    } else {
        editorUtil.kickOut(req);
    }
}

exports.laborators = function(req) {
    var room = editorUtil.socketRoom(req);
    var users = editorUtil.users(req.session.user.pub_id, room);
    req.io.respond({
        success: true,
        laborators: users
    });
}

exports.save = function(req) {
    editorUtil.save(req, function(sucess) {
        req.io.respond({
            success: sucess
        });
    });
}

exports.permission = function(req) {
    connections.models.documents.roles.find({
        user_pub_id: req.data,
        document_pub_id: editorUtil.room(req)
    }, function(error, roles) {
        if(!error && !roles.empty) {
            if(roles[0].document.owner_id == req.session.user.id) {
                var socket = editorUtil.userSocket(req.data, editorUtil.socketRoom(req));

                if(socket in req.io.socket.manager.sockets.sockets) {
                    if(roles[0].access) {
                        req.io.socket.manager.sockets.sockets[socket].emit('editorExtras', {
                            readonly: true
                        });
                    } else {
                        req.io.socket.manager.sockets.sockets[socket].emit('editorExtras', {
                            docDelete: true
                        });
                    }
                }
            }
        }
    });
}
