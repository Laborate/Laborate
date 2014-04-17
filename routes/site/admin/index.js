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
        users_groups_count: function(callback) {
            req.models.users.groups.count(callback);
        },
        paid_count: function(callback) {
            req.models.users.count({
                pricing_id: req.db.tools.ne(1),
                deliquent: false
            }, callback);
        },
        posts_count: function(callback) {
            req.models.posts.count({
                parent_id: null,
            },callback);
        },
        posts_groups_count: function(callback) {
            req.models.posts.count({
                group_id: req.db.tools.ne(null)
            },callback);
        },
        posts_tags_count: function(callback) {
            req.models.posts.tags.count(callback);
        },
        tracking_hourly_count: function(callback) {
            var created = new Date();
            created.setMinutes(0);
            created.setSeconds(0);
            created.setMilliseconds(0);

            req.models.tracking.count({
                type: "web",
                created: req.db.tools.gte(created)
            }, callback);
        },
        tracking_daily_count: function(callback) {
            var created = new Date();
            created.setHours(0);
            created.setMinutes(0);
            created.setSeconds(0);
            created.setMilliseconds(0);

            req.models.tracking.count({
                type: "web",
                created: req.db.tools.gte(created)
            }, callback);
        },
        tracking_monthly_count: function(callback) {
            var created = new Date();
            created.setMonth(created.getMonth() - 1);
            created.setHours(0);
            created.setMinutes(0);
            created.setSeconds(0);
            created.setMilliseconds(0);

            req.models.tracking.count({
                type: "web",
                created: req.db.tools.gte(created)
            }, callback);
        },
        tracking_yearly_count: function(callback) {
            var created = new Date();
            created.setFullYear(created.getFullYear() - 1);
            created.setMonth(0);
            created.setHours(0);
            created.setMinutes(0);
            created.setSeconds(0);
            created.setMilliseconds(0);

            req.models.tracking.count({
                type: "web",
                created: req.db.tools.gte(created)
            }, callback);
        },
        tracking_hourly_loggedin_count: function(callback) {
            var created = new Date();
            created.setMinutes(0);
            created.setSeconds(0);
            created.setMilliseconds(0);

            req.models.tracking.count({
                type: "web",
                created: req.db.tools.gte(created),
                user_id: req.db.tools.ne(null)
            }, callback);
        },
        tracking_daily_loggedin_count: function(callback) {
            var created = new Date();
            created.setHours(0);
            created.setMinutes(0);
            created.setSeconds(0);
            created.setMilliseconds(0);

            req.models.tracking.count({
                type: "web",
                created: req.db.tools.gte(created),
                user_id: req.db.tools.ne(null)
            }, callback);
        },
        tracking_monthly_loggedin_count: function(callback) {
            var created = new Date();
            created.setMonth(created.getMonth() - 1);
            created.setHours(0);
            created.setMinutes(0);
            created.setSeconds(0);
            created.setMilliseconds(0);

            req.models.tracking.count({
                type: "web",
                created: req.db.tools.gte(created),
                user_id: req.db.tools.ne(null)
            }, callback);
        },
        tracking_yearly_loggedin_count: function(callback) {
            var created = new Date();
            created.setFullYear(created.getFullYear() - 1);
            created.setMonth(0);
            created.setHours(0);
            created.setMinutes(0);
            created.setSeconds(0);
            created.setMilliseconds(0);

            req.models.tracking.count({
                type: "web",
                created: req.db.tools.gte(created),
                user_id: req.db.tools.ne(null)
            }, callback);
        },
        feedback: function(callback) {
            req.models.users.feedback.all({}, {
                autoFetch: true
            }, ["created", "Z"], callback);
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
                            user.locations = Object.keys(user.locations).length;

                            req.models.documents.count({
                                owner_id: user.id
                            }, function(error, count) {
                                user.documents = count;
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
                paid: data.paid_count,
                groups: data.users_groups_count
            },
            posts: {
                total: data.posts_count,
                groups: data.posts_groups_count,
                tags: data.posts_tags_count
            },
            tracking: {
                hourly: data.tracking_hourly_count,
                daily: data.tracking_daily_count,
                monthly: data.tracking_monthly_count,
                yearly: data.tracking_yearly_count,

                hourly_loggedin: data.tracking_hourly_loggedin_count,
                daily_loggedin: data.tracking_daily_loggedin_count,
                monthly_loggedin: data.tracking_monthly_loggedin_count,
                yearly_loggedin: data.tracking_yearly_loggedin_count
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
            js: clientJS.renderTags("admin"),
            css: clientCSS.renderTags("admin"),
            pageTrack: true
        });
    });
}
