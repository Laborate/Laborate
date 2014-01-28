var _this = exports;
var editorUtil = require("./editorUtil");

exports.join = function(req) {
    if(req.session.user) {
        editorUtil.accessCheck(req, function(error, response) {
            if(!error && response) {
                editorUtil.broadcast(req, "laborators");
                editorUtil.broadcast(req, "chatroom joined");
                req.io.respond(response);
            } else {
                editorUtil.error(req, error || "problems");
            }
        });
    } else {
        editorUtil.error(req, "kickout");
    }
}

exports.disconnectAll = function(req, user) {
    if(req.session.user) {
        var manager = req.io.socket.manager;
        var sockets = manager.sockets.sockets;
        user = user || req.session.user.pub_id;

        editorUtil.userSocket(req, user, function(socket) {
            if(socket in sockets) {
                editorUtil.broadcast(req, "document deleted", sockets[socket]);
            }

            req.io.respond({ success: true });
            manager.onClientDisconnect(socket, "forced");
            _this.leave(req, true);

            editorUtil.broadcast(req, "laborators");
        });
    }
}

exports.leave = function(req, override) {
    if(req.session.user) {
        var manager = req.io.socket.manager;
        var sockets = manager.sockets.sockets;

        editorUtil.userSocket(req, req.session.user.pub_id, function(socket) {
            //Only Non-forced Disconnects
            if((req.data == "booted" && socket == req.io.socket.id) || override == true) {
                editorUtil.broadcast(req, "chatroom left");
                editorUtil.saveDocument(req);
            }

            editorUtil.removeUser(req);
            editorUtil.broadcast(req, "laborators");
        });
    }
}

exports.chatRoom = function(req) {
    if(req.session.user) {
        req.data.name = req.session.user.screen_name;
        req.data.from = req.session.user.pub_id;
        req.data.gravatar = req.session.user.gravatar;
        req.io.room(editorUtil.room(req, true)).broadcast('editorChatRoom', req.data);
    } else {
        editorUtil.error(req, "kickout");
    }
}

exports.document = function(req) {
    if(req.session.user) {
        var room = editorUtil.room(req, true);
        req.data.from = req.session.user.pub_id;
        req.data.gravatar = req.session.user.gravatar;
        req.io.room(editorUtil.room(req, true)).broadcast('editorDocument', req.data);

        editorUtil.getRedis(room, function(error, document) {
            document.changes.push(req.data.changes);
            editorUtil.setRedis(room, document);
        });
    } else {
        editorUtil.error(req, "kickout");
    }
}

exports.cursors = function(req) {
    if(req.session.user) {
        req.data.from = req.session.user.pub_id;
        req.data.gravatar = req.session.user.gravatar;
        req.io.room(editorUtil.room(req, true)).broadcast('editorCursors', req.data);
    } else {
        editorUtil.error(req, "kickout");
    }
}

exports.laborators = function(req) {
    if(req.session.user) {
        editorUtil.users(req, function(users) {
            console.log(Object.keys(users));
            delete users[req.session.user.pub_id];

            req.io.respond({
                success: true,
                laborators: Object.keys(users)
            });
        });
    } else {
        editorUtil.error(req, "kickout");
    }
}
