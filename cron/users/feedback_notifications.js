var async = require('async');

require('../init')("user.feedback", function() {
    var _this = this;
    var today = new Date();

    _this.models.users.find({
        feedback: false,
        feedback_asked: false,
        admin: false
    }, {autoFetch: true}, function(error, users) {
        if(!error && !users.empty) {
            async.each(users, function(user, next) {
                var timeDiff = Math.abs(today.getTime() - user.created.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                if(diffDays >= 3 && user.feedbacks.empty) {
                    async.parallel([
                        function(callback) {
                            user.save({
                                feedback_asked: true
                            }, callback);
                        },
                        function(callback) {
                            _this.models.notifications.create({
                                message: "We noticed you have been using our service \
                                for a couple days, do you have any <a href='/feedback/'>feedback</a>?",
                                priority: true,
                                user_id: user.id
                            }, callback);
                        }, function(callback) {
                            if(config.general.production) {
                                 _this.email("feedback", {
                                    subject: "Help Us Improve",
                                    users: [{
                                        email: user.email,
                                        name: user.name
                                    }]
                                }, callback);
                            } else {
                                callback();
                            }
                        }

                    ], next);
                } else {
                    next();
                }
            }, function(errors) {
                lib.error.capture(errors);
                _this.finish();
            });
        } else {
            lib.error.capture(error);
            _this.finish();
        }
    });
});
