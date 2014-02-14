var async = require('async');

exports.index = function(req, res, next) {
    async.parallel({
        users_count: req.models.users.count,
        documents_count: req.models.documents.count,
        paid_count: function(callback) {
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
        },
        users: function(callback) {
            req.models.users.all({}, {
                autoFetch: false
            })
                .only(config.admin.users.table.fields)
                .order("created", "Z")
                .run(callback);
        }
    }, function(errors, data) {
        res.renderOutdated('admin/index', {
            title: 'Admin',
            users: {
                total: data.users_count,
                paid: data.paid_count
            },
            documents: data.documents_count,
            questions: config.feedback.questions,
            feedbacks: data.feedback,
            tables: {
                users: {
                    headers: config.admin.users.table.headers,
                    body: data.users
                }
            },
            top_documents: data.top_documents,
            js: clientJS.renderTags("admin"),
            css: clientCSS.renderTags("admin"),
            pageTrack: true
        });
    });
}
