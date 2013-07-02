async = require("async");

exports.index = function(req, res, next) {
    async.series([
        function(callback) {
            req.models.documents.count({
                owner_id: req.session.user.id,
                password: req.db.tools.ne(null)
            }, function(error, count) {
                if(!error) {
                    req.session.user.pass_documents = count;
                } else {
                    req.session.user.pass_documents = null;
                }
                callback(error);
            });
        }
    ], next)
}
