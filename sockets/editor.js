var editorUtil = require("./editorUtil");

/* Route Functions */
exports.join = function(req) {
    if(req.session.user) {
        editorUtil.accessCheck(req.session.user.id, editorUtil.room(req), req.data[0], function(access_object) {
            if(access_object.success) {
                if(!editorUtil.inRoom(req.data[1], req.session.user.screen_name, editorUtil.socketRoom(req))) {
                    editorUtil.clientData(editorUtil.socketRoom(req), access_object, function(data) {
                        editorUtil.addUser(req, req.session.user.screen_name, editorUtil.socketRoom(req));
                        req.io.respond(data);
                    });
                } else {
                    req.io.respond({
                        success: false,
                        error_message: "You Are Already Editing This Document"
                    });
                }
            } else {
                editorUtil.kickOut(req, access_object);
            }
        });
    } else {
        editorUtil.kickOut(req);
    }
}

exports.disconnectAll = function(req) {
    if(req.session.user) {
        var socket = editorUtil.userSocket(req.session.user.screen_name, editorUtil.socketRoom(req));
        if(socket in req.io.socket.manager.sockets.sockets) {
            req.io.socket.manager.sockets.sockets[socket].emit('editorExtras', { "docDelete": true });
        }
        req.io.respond({ success: true });
        req.io.socket.manager.onClientDisconnect(req.io.socket.id, "forced");
        exports.leave(req, true);
    }
}

exports.leave = function(req, override) {
    if(req.session.user) {
        var socket = editorUtil.userSocket(req.session.user.screen_name, editorUtil.socketRoom(req));
        //Only Non-forced Disconnects
        if((req.data == "booted" && socket == req.io.socket.id) || override == true) {
            req.io.room(editorUtil.socketRoom(req)).broadcast('editorChatRoom', {
                message: req.session.user.screen_name + " left the document",
                isStatus: true
            });
            editorUtil.removeUser(req, req.session.user.screen_name, editorUtil.socketRoom(req));
        }
    } else {
        editorUtil.kickOut(req);
    }
}

exports.chatRoom = function(req) {
    if(req.session.user) {
        req.data.from = req.session.user.screen_name;
        req.data.gravatar = req.session.user.gravatar;
        req.io.room(editorUtil.socketRoom(req)).broadcast('editorChatRoom', req.data);
    } else {
        editorUtil.kickOut(req);
    }
}

exports.document = function(req) {
    if(req.session.user) {
        var redis = lib.redis();

        req.data.from = req.session.user.screen_name;
        req.data.gravatar = req.session.user.gravatar;
        req.io.room(editorUtil.socketRoom(req)).broadcast('editorDocument', req.data);

        redis.get(editorUtil.socketRoom(req), function(error, reply) {
            reply = JSON.parse(reply);
            reply.changes.push(req.data["changes"]);
            redis.set(editorUtil.socketRoom(req), JSON.stringify(reply));
        });
    }
}

exports.cursors = function(req) {
    if(req.session.user) {
        req.data.from = req.session.user.screen_name;
        req.data.gravatar = req.session.user.gravatar;
        req.io.room(editorUtil.socketRoom(req)).broadcast('editorCursors', req.data);
    } else {
        editorUtil.kickOut(req);
    }
}

exports.extras = function(req) {
    var redis = lib.redis();

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
        redis.get(editorUtil.socketRoom(req), function(error, reply) {
            callback(JSON.parse(reply));
        });
    }

    this.save = function(data) {
        redis.set(editorUtil.socketRoom(req), JSON.stringify(data));
    }

    //Logic
    if(req.session.user) {
        req.data.from = req.session.user.screen_name;
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
