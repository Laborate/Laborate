var editor = require("./editor");
var connections = { redis: lib.redis() };
lib.models_init(connections);

exports.pageTrack = function(req) {
    req.session.last_page = req.data;
    req.session.save();
}

exports.notifications = function(req) {
    if(req.session.user) {
        var url = req.headers.referer.replace(req.session.server + "/", "");
        if(!(/^account\/.*/.test(url))) {
            connections.models.notifications.exists({
                user_id: req.session.user.id,
                priority: true
            }, function(error, exists) {
                req.io.respond(!error && exists);
            });
        } else {
            req.io.respond(false);
        }
    } else {
        req.io.respond(false);
    }
}

exports.leave = function(req) {
    switch(true) {
        case /.*\/editor\/\d*/g.test(req.headers.referer):
           editor.leave(req);
           break;
    }
}
