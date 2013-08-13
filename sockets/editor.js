var editorUtil = require("./editorUtil");

/* Route Functions */
exports.join = function(req) {
    editorUtil.models.documents.get(editorUtil.room(req), function(error, document) {
        if(!error && document) {
            if(!document.password || req.data[0] == document.password) {
                if(req.data[1] || !editorUtil.inRoom(req.session.user.screen_name, editorUtil.socketRoom(req))) {
                    editorUtil.addUser(req, req.session.user.screen_name, editorUtil.socketRoom(req), document.content);
                    req.io.room(editorUtil.socketRoom(req)).broadcast('editorChatRoom', {
                        message: req.session.user.screen_name + " joined the document",
                        isStatus: true
                    });

                    req.io.respond({
                        success: true,
                        content: (document.content) ? document.content.join("\n") : ""
                    });
                } else {
                    req.io.respond({
                        success: false,
                        error_message: "You Are Already Editing This Document"
                    });
                }
            } else {
                req.io.respond({
                    success: false,
                    error_message: "Incorrect Password",
                    redirect_url: "/documents/"
                });

                //Force Socket Disconnect
                req.io.socket.manager.onClientDisconnect(req.io.socket.id, "forced");
            }
        } else {
            req.io.respond({
                success: false,
                error_message: "Document Does Not Exist",
                redirect_url: "/documents/"
            });

            //Force Socket Disconnect
            req.io.socket.manager.onClientDisconnect(req.io.socket.id, "forced");
        }
    });
}

exports.disconnectAll = function(req) {
    var socket = editorUtil.userSocket(req.session.user.screen_name, editorUtil.socketRoom(req));
    if(socket in req.io.socket.manager.sockets.sockets) {
        req.io.socket.manager.sockets.sockets[socket].emit('editorExtras', { "docDelete": true });
    } else {
        //Remove Any Users Logged In Under These Credentials;
        exports.leave(req, true);
    }
    req.io.respond({ success: true });
    req.io.socket.manager.onClientDisconnect(req.io.socket.id, "forced");
}

exports.leave = function(req, override) {
    var socket = editorUtil.userSocket(req.session.user.screen_name, editorUtil.socketRoom(req));
    //Only Non-forced Disconnects
    if((req.data == "booted" && socket == req.io.socket.id) || override == true) {
        req.io.room(editorUtil.socketRoom(req)).broadcast('editorChatRoom', {
            message: req.session.user.screen_name + " left the document",
            isStatus: true
        });
        editorUtil.removeUser(req, req.session.user.screen_name, editorUtil.socketRoom(req));
    }
}

exports.chatRoom = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(editorUtil.socketRoom(req)).broadcast('editorChatRoom', req.data);
}

exports.document = function(req) {
    console.log(req.data["changes"]);
    req.data["from"] = req.session.user.screen_name;
    req.io.room(editorUtil.socketRoom(req)).broadcast('editorDocument', req.data);
}

exports.cursors = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(editorUtil.socketRoom(req)).broadcast('editorCursors', req.data);
}

exports.extras = function(req) {
    req.io.room(editorUtil.socketRoom(req)).broadcast('editorExtras', req.data);
}
