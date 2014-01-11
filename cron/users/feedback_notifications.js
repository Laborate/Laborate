var async = require('async');

require('../init')("user.feedback", function() {
    var _this = this;
    var today = new Date();

    _this.models.users.find({
        feedback: false,
        feedback_asked: false
    }, {autoFetch: true}, function(error, users) {
        if(!error && !users.empty) {
            $.each(users, function(key, user) {
                var timeDiff = Math.abs(today.getTime() - user.created.getTime());
                var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                if(diffDays >= 3 && user.feedbacks.empty) {
                    user.save({
                        feedback_asked: true
                    }, lib.error.capture);

                    _this.models.notifications.create({
                        message: "We noticed you have been using our service, \
                        for a couple days, do you have any <a href='/feedback/'>feedback</a>?",
                        priority: true,
                        user_id: user.id
                    }, lib.error.capture);

                     _this.email("feedback", {
                        subject: "Help Us Improve",
                        users: [{
                            email: user.email,
                            name: user.name
                        }]
                    }, lib.error.capture);

                    if(users.end(key)) {
                        _this.finish();
                    }
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
