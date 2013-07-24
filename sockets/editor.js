var redis = require('redis')
var client = redis.createClient();
var models;
require("../lib/models").socket(function(response) {
    models = response;
});

/* Action Functions */
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

exports.addUser = function(req, user, room, document) {
    if(!(room in exports.roomUsers)) {
        exports.roomUsers[room] = {};
        client.set(room, document);
    }

    if(!(user in exports.roomUsers[room])) {
        req.io.join(exports.socketRoom(req));
        exports.roomUsers[room][user] = setInterval(function() {
            req.io.emit('editorUsers', exports.users(user, room));
        }, 2000);
    }
}

exports.removeUser = function(req, user, room) {
    if(room in exports.roomUsers) {
        if(user in exports.roomUsers[room]) {
            req.io.leave(exports.socketRoom(req));
            clearInterval(exports.roomUsers[room][user]);
            delete exports.roomUsers[room][user];

            if(exports.roomUsers[room].length == 0) {
                delete exports.roomUsers[room];
                client.get(room, function(error, reply) {
                     models.documents.get(room, function(error, document) {
                        document.content = (reply.length != 0) ? reply : null;
                        client.del(room);
                     });
                });
            }
        }
    }
}

exports.room = function(req) {
    return req.headers.referer.split("/").slice(-2, -1);
}

exports.socketRoom = function(req) {
    return "editor" + exports.room(req);
}

/* Route Functions */
exports.join = function(req) {
    console.log("attempted to join");
    models.documents.get(exports.room(req), function(error, document) {
        if(!error) {
            if(!document.password || req.data == document.password) {
                exports.addUser(req, req.session.user.screen_name, exports.socketRoom(req), document.content);
                req.io.room(exports.socketRoom(req)).broadcast('editorChatRoom', {
                    message: req.session.user.screen_name + " joined the document",
                    isStatus: true
                });

                req.io.respond({
                    success: true,
                    content: document.content
                });
                console.log("joined");
            } else {
                req.io.respond({
                    success: false,
                    error_message: "Incorrect Password"
                });
            }
        } else {
            req.io.respond({
                success: false,
                error_message: "Incorrect Password"
            });
        }
    });
}

exports.leave = function(req) {
    req.io.room(exports.socketRoom(req)).broadcast('editorChatRoom', {
        message: req.session.user.screen_name + " left the document",
        isStatus: true
    });
    exports.removeUser(req, req.session.user.screen_name, exports.socketRoom(req));
}

exports.chatRoom = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(exports.socketRoom(req)).broadcast('editorChatRoom', req.data);
}

exports.document = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(exports.socketRoom(req)).broadcast('editorDocument', req.data);
}

exports.cursors = function(req) {
    req.data["from"] = req.session.user.screen_name;
    req.io.room(exports.socketRoom(req)).broadcast('editorCursors', req.data);
}

exports.extras = function(req) {
    req.io.room(exports.socketRoom(req)).broadcast('editorExtras', req.data);
}
