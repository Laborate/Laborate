exports.join = function(req) {
    var room = req.headers.referer.split("/").slice(-2, -1);
    req.io.join(req.data);
    req.io.room(room).broadcast('editorChatRoom', {
        message: req.session.user.screen_name + " joined the document",
        isStatus: true
    });
}

exports.leave = function(req) {
    var room = req.headers.referer.split("/").slice(-2, -1);
    req.io.leave(req.session.room);
    req.io.room(room).broadcast('editorChatRoom', {
        message: req.session.user.screen_name + " left the document",
        isStatus: true
    });
}

exports.chatRoom = function(req) {
    var room = req.headers.referer.split("/").slice(-2, -1);
    req.data["from"] = req.session.user.screen_name;
    req.io.room(room).broadcast('editorChatRoom', req.data);
}
