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
                    console.log(pricings[0].id);
                    if(!error && pricings.length == 1) {
                        user.save({
                            deliquent: false,
                            pricing_id: pricings[0].id
                        }, function(error) {
                            console.log(error);
                        });
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
