var async = require("async");
var stripe = require("stripe")(function() {
    if(config.general.production) {
        return config.stripe.production;
    } else {
        return config.stripe.development;
    }
}());

module.exports = function() {
    this.models(function(db, models) {
        if(config.stripe.reset) {
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
                    models.pricing.all(function(error, pricings) {
                        $.each(pricings, function(key, pricing) {
                            stripe.plans.create({
                                amount: (pricing.amount * 100),
                                currency: pricing.currency,
                                interval: pricing.interval,
                                interval_count: pricing.interval_count,
                                name: pricing.name,
                                id: pricing.plan
                            }, function(error) {
                                if(key == pricings.length-1) {
                                    callback(error);
                                }
                            });
                        });
                    });
                }
            ], lib.error.capture);
        }
    });

    stripe.next_month = this.core.days.next_month;
    return stripe;
}
