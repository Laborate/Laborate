exports.join = function(req) {
    req.io.join("news");
}

exports.post = function(req) {
    req.io.room("news").broadcast('newsPost', req.data);
}

exports.reply = function(req) {
    req.io.room("news").broadcast('newsReply', req.data);
}
