//////////////////////////////////////////////////
//          Account Instances
/////////////////////////////////////////////////
window.account = {
    timer: null,
    activated: null,
    location: function(location, history) {
        $(".locations .item").removeClass("activated");
        $(".locations .item[data-key='" + location + "']").addClass("activated");
        $(".pane .selection").hide();
        $(".pane .selection[data-key='" + location + "']").show();
        if(history) window.history.pushState(null, null, "/account/" + location + "/");
        window.socketUtil.pageTrack();
        window.account.activated = location;
    },
    locationSubmit: function(form) {
        var passed = true;
        var data = { _csrf: window.config.csrf };
        var submit =  form.find("input[type=submit]");

        if(!submit.attr("data-original")) submit.attr("data-original", submit.val());
        if(window.account.timer) clearInterval(window.account.timer);

        submit.val("loading...");

        form.find("input").each(function() {
            if(!$(this).val()) {
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

                    window.account.timer = setTimeout(function() {
                        submit.val(submit.attr("data-original"))
                    }, 5000);

                    if(result.callback) eval(result.callback);
                } else {
                    submit
                        .val(result.error_message)
                        .removeClass("disabled")
                        .addClass("error");

                    window.account.timer = setTimeout(function() {
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

            window.account.timer = setTimeout(function() {
                submit
                    .val(submit.attr("data-original"))
                    .removeClass("error");
            }, 5000);
        }
    },
    locationRemove: function(item) {
        var listing = $(".selection[data-key=locations] .listing");
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
                            You Don't Have Any Locations. <a href='/documents/'>Add Some</a> \
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

        if(type != "Unknown") {
            $("#card-company")
                .attr("src", "/img/cards/" + type.toLowerCase().split(" ")[0] + ".png")
                .load(function() {
                    $("#card-company").fadeIn(200);
                });
        } else {
            $("#card-company").fadeOut(200);
        }
    },
    cardRemove: function(item) {
        $.post("/account/billing/card/remove", {
            _csrf: window.config.csrf
        }, function(result) {
            if(result.success) {
                window.location.reload();
            } else {
                item
                    .addClass("error")
                    .find(".remove")
                    .text("Failded")
            }
        });
    },
}
