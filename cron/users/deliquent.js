require('../init')(function() {
    var _this = this;
    this.models.users.find({
        deliquent: true
    }, function(error, users) {
        if(!error) {
            $.each(users, function(key, user) {
                _this.models.pricing.find({
                    student: user.pricing.student,
                    organization: false
                }, [ "id", "A" ], 1, function(error, pricings) {
                    if(!error && pricings.length == 1) {
                        //Delay To Prevent Database Overload
                        setTimeout(function() {
                            user.setPricing(pricings[0], lib.error.capture);
                            user.save({ deliquent: false },  lib.error.capture);
                        }, 100);
                    } else {
                        lib.error.capture(error);
                    }
                });
            });
        } else {
            lib.error.capture(error);
        }
    });
});
