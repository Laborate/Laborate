var models;
require("../lib/models").socket(function(response) {
    models = response;
});

exports.pageTrack = function(req) {
    req.session.last_page = req.data;
    req.session.save();
}

exports.notifications = function(req) {
    var url = req.headers.referer.replace(config.general.server + "/", "");
    if(!(/^account\/.*/.test(url))) {
        models.notifications.exists({
            user_id: req.session.user.id,
            priority: true
        }, function(error, exists) {
            req.io.respond(!error && exists);
        });
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
