exports.models;
require("../lib/models").socket(function(response) {
    exports.models = response;
});

exports.client = require('redis').createClient();
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
    if(!req.data[1]) {
        if(!(room in exports.roomUsers)) {
            exports.roomUsers[room] = {};
            exports.client.set(room, document);
        }

        if(!(user in exports.roomUsers[room])) {
            req.io.join(exports.socketRoom(req));
            exports.roomUsers[room][user] = setInterval(function() {
                req.io.emit('editorUsers', exports.users(user, room));
            }, 2000);
        }
    }
}

exports.removeUser = function(req, user, room) {
    if(room in exports.roomUsers) {
        if(user in exports.roomUsers[room]) {
            clearInterval(exports.roomUsers[room][user]);
            delete exports.roomUsers[room][user];
            req.io.leave(exports.socketRoom(req));
            req.io.socket.disconnect();

            if(exports.roomUsers[room].length == 0) {
                delete exports.roomUsers[room];
                exports.client.get(room, function(error, reply) {
                     exports.models.documents.get(room, function(error, document) {
                        document.content = (reply.length != 0) ? reply : null;
                        exports.client.del(room);
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

exports.inRoom = function(user, room) {
    if(room in exports.roomUsers) {
        if(user in exports.roomUsers[room]) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}
