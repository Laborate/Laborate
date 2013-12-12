require("../lib").models(exports);

exports.pageTrack = function(req) {
    req.session.last_page = req.data;
    req.session.save();
}

exports.notifications = function(req) {
    if(req.session.user) {
        var url = req.headers.referer.replace(req.session.server + "/", "");
        if(!(/^account\/.*/.test(url))) {
            exports.models.notifications.exists({
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

exports.connect = function(req) {
    var address = req.handshake.address;
    console.log("Socket IP: " + address.address + ":" + address.port);
}

exports.leave = function(req) {
    switch(true) {
        case /.*\/editor\/\d*/g.test(req.headers.referer):
           require("./editor").leave(req);
           break;
    }
}
