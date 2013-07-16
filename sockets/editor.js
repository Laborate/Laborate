exports.room = function(req) {
    return "editor" + req.headers.referer.split("/").slice(-2, -1);
}

exports.join = function(req) {
    req.io.join(exports.room(req));
    req.io.room(exports.room(req)).broadcast('editorChatRoom', {
        message: req.session.user.screen_name + " joined the document",
        isStatus: true
    });
}

exports.leave = function(req) {
    req.io.leave(exports.room(req));
    req.io.room(exports.room(req)).broadcast('editorChatRoom', {
        message: req.session.user.screen_name + " left the document",
        isStatus: true
    });
}

exports.chatRoom = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(exports.room(req)).broadcast('editorChatRoom', req.data);
}

exports.document = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(exports.room(req)).broadcast('editorDocument', req.data);
}

exports.users = function(req) {
    //req.io.room(exports.room(req)).broadcast('editorUsers', clients[exports.room(req)]);
}

exports.cursors = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(exports.room(req)).broadcast('editorCursors', req.data);
}
