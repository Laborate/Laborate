var lib = require("../lib")
lib.models(exports);

exports.pageTrack = function(req) {
    exports.track(req, req.session);
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

exports.track = function(req, session) {
    lib.redis.get("tracking", function(error, data) {
        var user = (session) ? (session.user || {}) : {};
        var organization = (session) ? (session.organization || {}) : {};
        var address = req.handshake.address;
        var location = lib.geoip(address.address);
        var tracking = (data) ? JSON.parse(data) : [];

        tracking.push({
            type: "socket",
            lat: location.ll[0],
            lon: location.ll[1],
            ip: address.address,
            port: address.port,
            user_id: user.id || null,
            organization_id: organization.id || null
        });

        lib.redis.set(
            "tracking",
            JSON.stringify(tracking),
            lib.error.capture
        );
    });
}

exports.leave = function(req) {
    switch(true) {
        case /.*\/editor\/\d*/g.test(req.headers.referer):
           require("./editor").leave(req);
           break;
    }
}
