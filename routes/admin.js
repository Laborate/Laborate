var async = require('async');

exports.index = function(req, res, next) {
    async.parallel({
        users: req.models.users.count,
        documents: req.models.documents.count,
        paid: function(callback) {
            req.models.users.count({
                pricing_id: req.db.tools.ne(1),
                deliquent: false
            }, callback);
        },
        feedback: function(callback) {
            req.models.users.feedback.all({}, {
                autoFetch: true
            }, ["created", "Z"], callback);
        },
        top_documents: function(callback) {
            req.models.documents.all({}, {
                autoFetch: true,
                autoFetchLimit: 1
            }, ["viewed", "Z"], 10, callback);
        }
    }, function(errors, data) {
        res.renderOutdated('admin/index', {
            title: 'Admin',
            users: {
                total: data.users,
                paid: data.paid
            },
            documents: data.documents,
            questions: config.feedback.questions,
            feedbacks: data.feedback,
            top_documents: data.top_documents,
            js: clientJS.renderTags("admin"),
            css: clientCSS.renderTags("admin"),
            pageTrack: true
        });
    });
}
