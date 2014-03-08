exports.join = function(req) {
    req.io.join("news");
}

exports.post = function(req) {
    if(req.session.user) {
        req.data.from = req.session.user.pub_id;
        req.io.room("news").broadcast('newsPost', req.data);
    }
}

exports.reply = function(req) {
    if(req.session.user) {
        req.data.from = req.session.user.pub_id;
        req.io.room("news").broadcast('newsReply', req.data);
    }
}

exports.like = function(req) {
    if(req.session.user) {
        req.data.from = req.session.user.pub_id;
        req.io.room("news").broadcast('newsLike', req.data);
    }
}
