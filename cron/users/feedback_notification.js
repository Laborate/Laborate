require('../init')("user.feedback", function() {
    var _this = this;
    var today = new Date();

    _this.models.users.find({
        feedback: false,
    }, function(error, users) {
        if(!error && !users.empty) {
            $.each(users, function(key, user) {
                var timeDiff = Math.abs(today.getTime() - user.created.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                if(diffDays >= 2 && user.feedbacks.empty) {
                    _this.models.notifications.create({
                        message: "We noticed you have been using our service, \
                        for a couple days, do you have any <a href='/feedback/'>feedback</a>?",
                        priority: true,
                        user_id: user.id
                    }, function(error) {
                        lib.error.capture(error);

                        _this.email("feedback", {
                            subject: "Help Us Improve",
                            users: [{
                                email: user.email,
                                name: user.name
                            }]
                        }, function(error) {
                            lib.error.capture(error);

                            if(users.end(key)) {
                                _this.finish();
                            }
                        });
                    });
                } else if(users.end(key)) {
                    _this.finish();
                }
            });
        } else {
            lib.error.capture(error);
            _this.finish();
        }
    });
});
