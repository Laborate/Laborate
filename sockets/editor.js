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
