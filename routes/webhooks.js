exports.stripe = function(req, res) {
    res.send(200);

    console.log(req.body.type);
    console.log(req.body.data);

    switch(req.body.type) {
        /* Charge Succeeded */
        case "charge.succeeded":
            if(req.body.data.object.amount != 0) {
                req.models.users.find({
                    stripe: req.body.data.object.customer
                }, function(error, users) {
                    if(!error && users.length == 1) {
                        req.models.payments.create({
                            description: "Charge: " + req.body.data.object.description,
                            amount: req.body.data.object.amount/100,
                            currency: req.body.data.object.currency,
                            plan: "Charge",
                            user_id: users[0].id
                        }, capture_error);
                    } else {
                        capture_error(error);
                    }
                });
            }
            break;

        /* Charge Refunded */
        case "charge.refunded":
            if(req.body.data.object.amount != 0) {
                req.models.users.find({
                    stripe: req.body.data.object.customer
                }, function(error, users) {
                    if(!error && users.length == 1) {
                        var amount = req.body.data.object.amount_refunded;
                        amount -= req.body.data.previous_attributes.amount_refunded;

                        req.models.payments.create({
                            description: "Refund: " + req.body.data.object.description,
                            amount: amount/100,
                            currency: req.body.data.object.currency,
                            plan: "Refund",
                            user_id: users[0].id
                        }, capture_error);
                    } else {
                        capture_error(error);
                    }
                });
            }
            break;

        /* Payment Succeeded */
        case "invoice.payment_succeeded":
            if(req.body.data.object.lines.data[0].amount != 0) {
                req.models.users.find({
                    stripe: req.body.data.object.customer
                }, function(error, users) {
                    if(!error && users.length == 1) {
                        var date = new Date(req.body.data.object.lines.data[0].period.start * 1000);
                        var monthNames = [ "January", "Feburary", "March", "April", "May", "June",
                                           "July", "August", "September", "October", "November", "December" ];
                        var month = (date.getUTCMonth() == 12) ? 0 : date.getUTCMonth();

                        users[0].save({
                            deliquent: false
                        }, capture_error);

                        req.models.payments.create({
                            description: "Invoice for " + monthNames[month] + " " + date.getFullYear(),
                            amount: req.body.data.object.lines.data[0].amount/100,
                            currency: req.body.data.object.lines.data[0].currency,
                            plan: req.body.data.object.lines.data[0].plan.name,
                            user_id: users[0].id
                        }, capture_error);
                    } else {
                        capture_error(error);
                    }
                });
            }
            break;

        /* Payment Failed */
        case "invoice.payment_failed":
            req.models.users.find({
                stripe: req.body.data.object.customer
            }, function(error, users) {
                if(!error && users.length == 1) {
                    if(req.body.data.object.next_payment_attempt) {
                        req.models.notifications.create({
                            message: "Your last payment failed, please enter a valid credit card. \
                                     We will try charging your card again in 3 days.",
                            priority: true,
                            user_id: users[0].id
                        }, capture_error);
                    } else {
                        users[0].save({ deliquent: true }, capture_error);
                    }
                } else {
                    capture_error(error);
                }
            });
            break;
    }
}
