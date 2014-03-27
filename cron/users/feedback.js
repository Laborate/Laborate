require('../init')("user.feedback", function() {
    var _this = this;
    _this.models.users.find({
        feedback: true
    }, function(error, users) {
        if(!error && !users.empty) {
            async.each(users, function(user, next) {
                user.save({
                    feedback: false
                }, next);
            }, _this.finish);
        } else {
            _this.finish(error);
        }
    });
});
