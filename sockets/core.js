exports.leave = function(req) {
    switch(true) {
        case /.*\/editor\/\d*/g.test(req.headers.referer):
           require("./editor").leave(req);
           break;

        default:
            require("./editor").leave(req);
            break;
    }
}
