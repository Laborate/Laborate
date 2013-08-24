var editorUtil = require("./editorUtil");

/* Route Functions */
exports.join = function(req) {
    if(req.session.user) {
        editorUtil.models.documents_roles.find({
            user_id: req.session.user.id,
            document_id: editorUtil.room(req)
        }, function(error, documents) {
            if(documents.length == 1 && !error) {
                var document = documents[0].document;
                if(!document.password || req.data[0] == document.password) {
                    if(req.data[1] || !editorUtil.inRoom(req.session.user.screen_name, editorUtil.socketRoom(req))) {
                        editorUtil.addUser(req, req.session.user.screen_name, editorUtil.socketRoom(req), document);
                        req.io.room(editorUtil.socketRoom(req)).broadcast('editorChatRoom', {
                            message: req.session.user.screen_name + " joined the document",
                            isStatus: true
                        });

                        req.io.respond({
                            success: true,
                            content: (document.content) ? document.content.join("\n") : "",
                            breakpoints: ((document.breakpoints) ? $.map(document.breakpoints, function(value) {
                                return {"line": value};
                            }) : [])
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
    } else {
        req.io.respond({
            success: false,
            error_message: "Log In Required",
            redirect_url: true
        });
    }
}

exports.disconnectAll = function(req) {
    if(req.session.user) {
        var socket = editorUtil.userSocket(req.session.user.screen_name, editorUtil.socketRoom(req));
        if(socket in req.io.socket.manager.sockets.sockets) {
            req.io.socket.manager.sockets.sockets[socket].emit('editorExtras', { "docDelete": true });
        }
        req.io.respond({ success: true });
        req.io.socket.manager.onClientDisconnect(req.io.socket.id, "forced");
        exports.leave(req, true);
    }
}

exports.leave = function(req, override) {
    if(req.session.user) {
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
}

exports.chatRoom = function(req) {
    if(req.session.user) {
        req.data["from"] = req.session.user.screen_name;
        req.io.room(editorUtil.socketRoom(req)).broadcast('editorChatRoom', req.data);
    }
}

exports.document = function(req) {
    if(req.session.user) {
        //console.log(req.data["changes"]);
        req.data["from"] = req.session.user.screen_name;
        req.io.room(editorUtil.socketRoom(req)).broadcast('editorDocument', req.data);
    }
}

exports.cursors = function(req) {
    if(req.session.user) {
        req.data["from"] = req.session.user.screen_name;
        req.io.room(editorUtil.socketRoom(req)).broadcast('editorCursors', req.data);
    }
}

exports.extras = function(req) {
    if(req.session.user) {
        req.io.room(editorUtil.socketRoom(req)).broadcast('editorExtras', req.data);

        if("breakpoint" in req.data) {
            editorUtil.redisClient.get(editorUtil.socketRoom(req), function(error, reply) {
                reply = JSON.parse(reply);

                if(!reply.breakpoints) {
                    reply.breakpoints = new Array();
                }

                $.each(req.data.breakpoint, function(index, value) {
                    if(value.remove) {
                        if(reply.breakpoints.indexOf(value.line) > -1) {
                            reply.breakpoints.splice(reply.breakpoints.indexOf(value.line), 1);
                        }

                        if(reply.breakpoints.length == 0) {
                            reply.breakpoints = null;
                        }
                    } else {
                        reply.breakpoints.push(value.line);
                    }
                });


                editorUtil.redisClient.set(editorUtil.socketRoom(req), JSON.stringify({
                    content: reply.content,
                    breakpoints: reply.breakpoints
                }));
            });
        }
    }
}
