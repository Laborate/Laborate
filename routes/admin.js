var async = require('async');

exports.index = function(req, res, next) {
    async.parallel({
        documents_count: function(callback) {
            req.models.documents.count(callback);
        },
        users_count: function(callback) {
            req.models.users.count({
                verify: null,
                admin: false
            }, callback);
        },
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
                .only(config.admin.users.table.values)
                .order("created", "Z")
                .run(function(error, users) {
                    if(!error) {
                        async.map(users, function(user, next) {
                            async.parallel([
                                function(done) {
                                    req.models.documents.count({
                                        owner_id: user.id
                                    }, function(error, count) {
                                        user.documents = count;
                                        done(error);
                                    });
                                }
                            ], function(error) {
                                next(error, user);
                            });
                        }, callback);
                    } else {
                        callback(error);
                    }
                });
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
                    fields: config.admin.users.table.fields,
                    values: data.users
                }
            },
            top_documents: data.top_documents,
            js: clientJS.renderTags("admin"),
            css: clientCSS.renderTags("admin"),
            pageTrack: true
        });
    });
}
