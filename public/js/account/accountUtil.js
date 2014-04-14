//////////////////////////////////////////////////
//          Account Instances
/////////////////////////////////////////////////
window.account = {
    timer: {},
    activated: null,
    location: function(location, history) {
        $(".sidebar .option").removeClass("activated");
        $(".sidebar .option[data-key='" + location + "']").addClass("activated");
        $(".main .selection").hide();
        $(".main .selection[data-key='" + location + "']").show();
        $(".notification").toggle(location != "notifications");
        if(history) window.history.pushState(null, null, "/account/" + location + "/");
        window.socketUtil.pageTrack();
        window.account.activated = location;
    },
    locationSubmit: function(form) {
        var timer = null;
        var passed = true;
        var data = { _csrf: window.config.csrf };
        var submit =  form.find("input[type=submit]");

        if(!submit.attr("data-original")) submit.attr("data-original", submit.val());
        if(window.account.timer[form.attr("action")]) clearInterval(window.account.timer[form.attr("action")]);

        submit.val("loading...");

        form.find("input").each(function() {
            if(!$(this).val() && $(this).data("required")) {
                passed = false;
                $(this).addClass("error");
            } else {
                if($(this).attr("id") == "card") {
                    if($.payment.validateCardNumber($(this).val())) {
                        data[$(this).attr("name")] = $(this).val();
                        $(this).removeClass("error");
                    } else {
                        passed = false;
                        $(this).addClass("error");
                    }
                } else if($(this).attr("id") == "expiration") {
                    var expiration = $(this).val().split(" / ");
                    if($.payment.validateCardExpiry(expiration[0], expiration[1])) {
                        data[$(this).attr("name")] = $(this).payment('cardExpiryVal');
                        $(this).removeClass("error");
                    } else {
                        passed = false;
                        $(this).addClass("error");
                    }
                } else if($(this).attr("id") == "cvc") {
                    if($.payment.validateCardCVC($(this).val())) {
                        data[$(this).attr("name")] = $(this).val();
                        $(this).removeClass("error");
                    } else {
                        passed = false;
                        $(this).addClass("error");
                    }
                } else {
                    data[$(this).attr("name")] = $(this).val();
                    $(this).removeClass("error");
                }
            }
        });

        if(passed) {
            submit.text("loading...").addClass("disabled");

            $.post(form.attr("action"), data, function(result) {
                if(result.success) {
                    submit.val(submit.attr("data-success"));

                    window.account.timer[form.attr("action")] = setTimeout(function() {
                        submit.val(submit.attr("data-original"))
                    }, 5000);

                    if(result.callback) eval(result.callback);
                } else {
                    submit
                        .val(result.error_message)
                        .removeClass("disabled")
                        .addClass("error");

                    window.account.timer[form.attr("action")] = setTimeout(function() {
                        submit
                            .val(submit.attr("data-original"))
                            .removeClass("error");
                    }, 5000);
                }
            });
        } else {
            submit
                .val("Incorrect or Missing Information")
                .removeClass("disabled")
                .addClass("error");

            window.account.timer[form.attr("action")] = setTimeout(function() {
                submit
                    .val(submit.attr("data-original"))
                    .removeClass("error");
            }, 5000);
        }
    },
    locationRemove: function(item) {
        var listing = $(".selection[data-key=locations] .listing");
        item
            .find(".action")
            .text("loading")
            .addClass("loading");

        $.post("/account/location/remove", {
            location: item.attr("data-id"),
            _csrf: window.config.csrf
        }, function(result) {
            if(result.success) {
                item.slideUp(200);
                setTimeout(function() {
                    item.remove();

                    if(listing.find(".item:not(.header)").length == 0) {
                        listing.html("<div class='item empty'> \
                            You Don't Have Any Locations. <a href='/documents/popup/add/location/'>Add Some</a> \
                        </div>");
                    }
                }, 350);
            } else {
                item
                    .addClass("error")
                    .find(".remove")
                    .text("Failded")
            }
        });
    },
    cardType: function() {
        var type = $.payment.cardType($(this).val());

        if(type && type != "Unknown") {
            $("#card-company")
                .attr("src", "/img/cards/" + type.toLowerCase().replace(" ", "") + ".png")
                .load(function() {
                    $("#card-company").fadeIn(200);
                });
        } else {
            $("#card-company").fadeOut(200);
        }
    },
    cardRemove: function(element) {
        element
            .text("loading")
            .addClass("loading");

        $.post("/account/billing/card/remove", {
            _csrf: window.config.csrf
        }, function(result) {
            if(result.success) {
                window.location.reload();
            } else {
                element.text("Failded");
            }
        });
    },
    planChange: function(element) {
        element
            .find(".button")
            .addClass("disabled")
            .text("loading");

        $.post("/account/billing/plan/", {
            plan: element.attr("data-plan"),
            _csrf: window.config.csrf
        }, function(result) {
            if(result.success) {
                window.location.reload();
            } else {
                element
                    .find(".button")
                    .addClass("error")
                    .removeClass("disabled")
                    .text("Failded");
            }
        });
    },
    notificationClose: function(element) {
        element.animate({ opacity: 0 }, 200);
        setTimeout(function() {
            element.slideUp(200);
            setTimeout(function() {
                element.remove();
            }, 300);
        }, 250);

        $(".main #notifications")
            .find(".item[data-id='" + element.attr("data-id") + "'] .priority")
            .removeClass("active");

        $.post("/account/notifications/hide/", {
            notification: element.attr("data-id"),
            _csrf: window.config.csrf
        });
    },
    notificationPriority: function(element) {
        element.find(".priority").removeClass("active");
        $(".notification[data-id='" + element.attr("data-id") + "']").remove();
        $.post("/account/notifications/hide/", {
            notification: element.attr("data-id"),
            _csrf: window.config.csrf
        });
    },
    notificationRemove: function(element) {
        var listing = $("#notifications");
        $.post("/account/notifications/remove/", {
            notification: element.attr("data-id"),
            _csrf: window.config.csrf
        }, function(result) {
            if(result.success) {
                element.slideUp(200);
                setTimeout(function() {
                    element.remove();

                    if(listing.find(".item:not(.header)").length == 0) {
                        listing.html("<div class='item empty'> \
                            Congratulations, you are all up to date! \
                        </div>");
                    }
                }, 350);
            } else {
                element
                    .addClass("error")
                    .find(".remove")
                    .text("Failded")
            }
        });
    }
}
