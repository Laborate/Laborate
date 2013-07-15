exports.room = function(req) {
    return req.headers.referer.split("/").slice(-2, -1);
}

exports.join = function(req) {
    req.io.join(req.data);
    req.io.room(exports.room(req)).broadcast('editorChatRoom', {
        message: req.session.user.screen_name + " joined the document",
        isStatus: true
    });
}

exports.leave = function(req) {
    req.io.room(exports.room(req)).broadcast('editorChatRoom', {
        message: req.session.user.screen_name + " left the document",
        isStatus: true
    });
    req.io.leave(exports.room(req));
}

exports.chatRoom = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(req.room).broadcast('editorChatRoom', req.data);
}

exports.document = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(req.room).broadcast('editorDocument', req.data);
}

exports.users = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(req.room).broadcast('editorUsers', req.data);
}

exports.cursors = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(req.room).broadcast('editorCursors', req.data);
}
