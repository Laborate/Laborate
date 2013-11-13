exports.stripe = function(req, res) {
    console.log(req.body);
    switch(req.body.type) {
        /* Trial Ending Soon */
        case "customer.subscription.trial_will_end":
            req.models.users.find({
                stripe: req.body.data.object.customer
            }, function(error, users) {
                if(!error && users.length == 1) {
                    req.models.users.notifications.create({
                        message: "Your trial is ending soon, please enter a valid credit card",
                        priority: true,
                        user_id: users[0].id
                    }, blank_function);

                    res.send(200);
                } else {
                    res.error(200, false, error);
                }
            });
            break;

        /* Payment Succeeded */
        case "invoice.payment_succeeded":
            req.models.users.find({
                stripe: req.body.data.object.customer
            }, function(error, users) {
                if(!error && users.length == 1) {
                    users[0].save({
                        trial: false,
                        deliquent: false
                    }, blank_function);
                    res.send(200);
                } else {
                    res.error(200, false, error);
                }
            });
            break;

        /* Payment Failed */
        case "invoice.payment_failed":
            req.models.users.find({
                stripe: req.body.data.object.customer
            }, function(error, users) {
                if(!error && users.length == 1) {
                    if(req.body.data.object.next_payment_attempt) {
                        req.models.users.notifications.create({
                            message: "Your last payment failed, please enter a valid credit card. \
                                     We will try charging your card again in 3 days.",
                            priority: true,
                            user_id: users[0].id
                        }, blank_function);
                    } else {
                        users[0].save({ deliquent: true }, blank_function);
                    }

                    res.send(200);
                } else {
                    res.error(200, false, error);
                }
            });
            break;

        default:
            res.send(200);
            break;
    }
}
