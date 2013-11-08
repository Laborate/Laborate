exports.pageTrack = function(req) {
    req.session.last_page = req.data;
    req.session.save();
}

exports.leave = function(req) {
    switch(true) {
        case /.*\/editor\/\d*/g.test(req.headers.referer):
           require("./editor").leave(req);
           break;
    }
}
