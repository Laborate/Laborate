var connections = { redis: lib.redis() };
lib.models_init(connections);

exports.connect = function(req) {
    if(config.cookies.rememberme in req.cookies) {
        if(!req.session.user) {
            connections.models.users.find({
                recovery: req.cookies[config.cookies.rememberme]
            }, function(error, user) {
                if(!error && user.length == 1) {
                    var user = user[0];
                    req.session.user = user;
                    req.session.save();
                }
            });
        }
    }
}

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
           require("./editor").leave(req);
           break;
    }
}
