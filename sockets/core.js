var editor = require("./editor");

exports.pageTrack = function(req) {
    exports.track(req, req.session);
    req.session.last_page = req.data;
    req.session.save();
}

exports.track = function(req, session) {
    if(req.handshake && req.headers) {
        var redis = lib.redis();
        redis.get("tracking", function(error, data) {
            var user = (session) ? (session.user || {}) : {};
            var organization = (session) ? (session.organization || {}) : {};
            var tracking = (data) ? JSON.parse(data) : [];
            var address = {
                ip: req.headers['x-forwarded-for'] || req.handshake.address.address,
                port: req.headers['x-forwarded-port'] || req.handshake.address.port
            };
            var location = lib.geoip(address.ip) || {
                city: null,
                region: null,
                country: null,
                ll: [null, null]
            };

            tracking.push({
                type: "socket",
                agent: req.handshake.headers['user-agent'],
                lat: location.ll[0],
                lon: location.ll[1],
                city: location.city,
                state: location.region,
                country: location.country,
                ip: address.ip,
                port: address.port,
                user_id: user.id || null,
                organization_id: organization.id || null,
                url: req.headers.referer
            });

            redis.set(
                "tracking",
                JSON.stringify(tracking),
                lib.error.capture
            );
        });
    }
}

exports.notifications = function(req) {
    if(req.session.user) {
        var url = req.headers.referer.replace(req.session.server + "/", "");
        if(!(/^account\/.*/.test(url))) {
            lib.models_init(null, function(db, models) {
                models.notifications.exists({
                    user_id: req.session.user.id,
                    priority: true
                }, function(error, exists) {
                    req.io.respond(!error && exists);
                });
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
