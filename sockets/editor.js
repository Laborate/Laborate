var editorUtil = require("./editorUtil");

/* Route Functions */
exports.join = function(req) {
    editorUtil.models.documents.get(editorUtil.room(req), function(error, document) {
        if(!error && document) {
            if(!document.password || req.data == document.password) {
                if(!editorUtil.inRoom(req.session.user.screen_name, editorUtil.socketRoom(req))) {
                    editorUtil.addUser(req, req.session.user.screen_name, editorUtil.socketRoom(req), document.content);
                    req.io.room(editorUtil.socketRoom(req)).broadcast('editorChatRoom', {
                        message: req.session.user.screen_name + " joined the document",
                        isStatus: true
                    });

                    req.io.respond({
                        success: true,
                        content: document.content
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
                    error_message: "Incorrect Password"
                });
            }
        } else {
            req.io.respond({
                success: false,
                error_message: "Document Does Not Exist"
            });
        }
    });
}

exports.leave = function(req) {
    console.log(req.io.socket.handshake.address)
    req.io.room(editorUtil.socketRoom(req)).broadcast('editorChatRoom', {
        message: req.session.user.screen_name + " left the document",
        isStatus: true
    });
    editorUtil.removeUser(req, req.session.user.screen_name, editorUtil.socketRoom(req));
}

exports.chatRoom = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(editorUtil.socketRoom(req)).broadcast('editorChatRoom', req.data);
}

exports.document = function(req) {
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
