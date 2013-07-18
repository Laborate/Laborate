exports.roomUsers = {};

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

exports.addUser = function(req, user, room) {
    if(!(room in exports.roomUsers)) {
        exports.roomUsers[room] = {};
    }

    if(!(user in exports.roomUsers[room])) {
        exports.roomUsers[room][user] = setInterval(function() {
            req.io.emit('editorUsers', exports.users(user, room));
        }, 2000);
    }
}

exports.removeUser = function(user, room) {
    if(room in exports.roomUsers) {
        if(user in exports.roomUsers[room]) {
            clearInterval(exports.roomUsers[room][user]);
            delete exports.roomUsers[room][user];
        }
    }
}

exports.room = function(req) {
    return "editor" + req.headers.referer.split("/").slice(-2, -1);
}

exports.join = function(req) {
    req.io.join(exports.room(req));
    req.io.room(exports.room(req)).broadcast('editorChatRoom', {
        message: req.session.user.screen_name + " joined the document",
        isStatus: true
    });
    exports.addUser(req, req.session.user.screen_name, exports.room(req));
}

exports.leave = function(req) {
    req.io.leave(exports.room(req));
    req.io.room(exports.room(req)).broadcast('editorChatRoom', {
        message: req.session.user.screen_name + " left the document",
        isStatus: true
    });
    exports.removeUser(req.session.user.screen_name, exports.room(req));
}

exports.chatRoom = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(exports.room(req)).broadcast('editorChatRoom', req.data);
}

exports.document = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(exports.room(req)).broadcast('editorDocument', req.data);
}

exports.cursors = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(exports.room(req)).broadcast('editorCursors', req.data);
}
