var connections = { redis: lib.redis() };
lib.models_init(connections);

exports.pageTrack = function(req) {
    exports.track(req, req.session);
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

exports.track = function(req, session) {
    if(req.handshake && req.headers) {
         connections.redis.get("tracking", function(error, data) {
            var user = (session) ? (session.user || {}) : {};
            var organization = (session) ? (session.organization || {}) : {};
            var address = req.handshake.address;
            var location = lib.geoip(address.address);
            var tracking = (data) ? JSON.parse(data) : [];

            tracking.push({
                type: "socket",
                agent: req.handshake.headers['user-agent'],
                lat: location.ll[0],
                lon: location.ll[1],
                city: location.city,
                state: location.region,
                country: location.country,
                ip: address.address,
                port: address.port,
                user_id: user.id || null,
                organization_id: organization.id || null,
                url: req.headers.referer
            });

             connections.redis.set(
                "tracking",
                JSON.stringify(tracking),
                lib.error.capture
            );
        });
    }
}

exports.leave = function(req) {
    switch(true) {
        case /.*\/editor\/\d*/g.test(req.headers.referer):
           require("./editor").leave(req);
           break;
    }
}
