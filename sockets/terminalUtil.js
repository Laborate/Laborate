exports.location = function(req, socket) {
    var location = /.*\/terminals\/(.*?)\/.*/.exec(req.headers.referer);

    if(location) {
        if(socket) {
            return "terminal" + location[1];
        } else {
            return req.session.user.locations[location[1]];
        }
    } else {
        return null;
    }
}
