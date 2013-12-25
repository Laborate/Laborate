require('../init')("user.feedback", function() {
    var _this = this;
    _this.models.users.find({
        feedback: true
    }, function(error, users) {
        if(!error && !users.empty) {
            $.each(users, function(key, user) {
                user.save({
                    feedback: false
                }, function(error) {
                    lib.error.capture(error);
                    _this.finish();
                });
            });
        } else {
            lib.error.capture(error);
            _this.finish();
        }
    });
});
