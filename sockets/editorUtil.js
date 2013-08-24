exports.models;
require("../lib/models").socket(function(response) {
    exports.models = response;
});

exports.redis = require('redis');
exports.redisClient = exports.redis.createClient();
exports.roomUsers = new Array();

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
        exports.roomUsers[room] = new Array();
        exports.redisClient.set(room, JSON.stringify({
            content: document.content,
            breakpoints: document.breakpoints
        }));
    }

    req.io.join(room);
    exports.roomUsers[room][user] = {
        "socket": req.io.socket.id,
        "update": setInterval(function() {
            req.io.emit('editorUsers', exports.users(user, room));
        }, 2000)
    }
}

exports.removeUser = function(req, user, room) {
    if(room in exports.roomUsers) {
        if(user in exports.roomUsers[room]) {
            clearInterval(exports.roomUsers[room][user]["update"]);
            delete exports.roomUsers[room][user];
            req.io.leave(exports.socketRoom(req));
            req.io.socket.disconnect();

            if(Object.keys(exports.roomUsers[room]).length == 0) {
                delete exports.roomUsers[room];
                exports.redisClient.get(room, function(error, reply) {
                    reply = JSON.parse(reply);
                    exports.models.documents.get(exports.room(req), function(error, document) {
                        if(!error && document) {
                            document.content = reply.content;
                            document.breakpoints = reply.breakpoints;
                        }
                        exports.redisClient.del(room);
                    });
                });
            }
        }
    }
}

exports.userSocket = function(user, room) {
    if(room in exports.roomUsers) {
        if(user in exports.roomUsers[room]) {
            return exports.roomUsers[room][user]["socket"];
        } else {
            return false;
        }
    } else {
        return false;
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
