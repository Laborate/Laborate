var async = require("async");
var stripe = require("stripe")(config.stripe);

require("../models").socket(function(models) {
    async.series([
        function(callback) {
            stripe.plans.list(function(error, plans) {
                if(!error && plans.data.length != 0) {
                    $.each(plans.data, function(key, plan) {
                        stripe.plans.del(plan.id, function(error) {
                            if(key == plans.length-1) {
                                callback(error);
                            }
                        });
                    });
                } else {
                    callback(null);
                }
            });
        },
        function(callback) {
            models.users.pricing.all(function(error, pricings) {
                $.each(pricings, function(key, pricing) {
                    stripe.plans.create({
                        amount: (pricing.amount * 100),
                        currency: pricing.currency,
                        interval: pricing.interval,
                        interval_count: pricing.interval_count,
                        name: pricing.name,
                        id: pricing.plan,
                        trial_period_days: pricing.trial
                    }, function(error) {
                        if(key == pricings.length-1) {
                            callback(error);
                        }
                    });
                });
            });
        }
    ], blank_function);
});

module.exports = function(req, res, next) {
    req.stripe = stripe;
    next();
}
