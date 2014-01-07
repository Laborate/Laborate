var async = require('async');

exports.index = function(req, res, next) {
    async.parallel({
        users: function(callback) {
            req.models.users.count(function(error, count) {
                callback(error, count);
            });
        },
        paid: function(callback) {
            req.models.users.count({
                pricing_id: req.db.tools.ne(1),
                deliquent: false
            }, function(error, count) {
                callback(error, count);
            });
        },
        feedback: function(callback) {
            req.models.users.feedback.all(function(error, feedback) {
                callback(error, feedback);
            });
        },
        documents: function(callback) {
            req.models.documents.all().count(function(error, count) {
                callback(error, count);
            });
        },
        top_documents: function(callback) {
            req.models.documents.all(
                ["viewed", "Z"],
                10,
            function(error, documents) {
                callback(error, documents);
            });
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
        });
    });
}
