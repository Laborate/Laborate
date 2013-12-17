require('../init')(function() {
    var _this = this;
    _this.models.users.find({
        deliquent: true
    }, function(error, users) {
        if(!error && users.length != 0) {
            $.each(users, function(key, user) {
                _this.models.pricing.find({
                    student: user.pricing.student,
                    organization: false
                }, [ "id", "A" ], 1, function(error, pricings) {
                    if(!error && pricings.length == 1) {
                        //Delay To Prevent Database Overload
                        setTimeout(function() {
                            user.setPricing(pricings[0], function(error, user) {
                                if(!error) {
                                    user.save({
                                        deliquent: false
                                    },  lib.error.capture);

                                    _this.models.notifications.create({
                                        message: "Your account has been downgraded to the free plan \
                                        becuase we attempted to charge your card 3 times and all failed.",
                                        priority: true,
                                        user_id: users[0].id
                                    }, lib.error.capture);
                                    if(users.end(key)) _this.finish();
                                } else {
                                    lib.error.capture(error);
                                    if(users.end(key)) _this.finish();
                                }
                            });
                        }, 100);
                    } else {
                        lib.error.capture(error);
                        if(users.end(key)) _this.finish();
                    }
                });
            });
        } else {
            lib.error.capture(error);
            _this.finish();
        }
    });
});
