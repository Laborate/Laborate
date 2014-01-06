//////////////////////////////////////////////////
//          Account Instances
/////////////////////////////////////////////////
window.admin = {
    timer: {},
    activated: null,
    location: function(location, history) {
        $(".list .item").removeClass("activated");
        $(".list .item[data-key='" + location + "']").addClass("activated");
        $(".pane .selection").hide();
        $(".pane .selection[data-key='" + location + "']").show();
        $(".notification").toggle(location != "notifications");
        if(history) window.history.pushState(null, null, "/admin/" + location + "/");
        window.socketUtil.pageTrack();
        window.admin.activated = location;
    },
    notificationClose: function(element) {
        element.animate({ opacity: 0 }, 200);
        setTimeout(function() {
            element.slideUp(200);
            setTimeout(function() {
                element.remove();
            }, 300);
        }, 250);

        $(".pane #notifications")
            .find(".item[data-id='" + element.attr("data-id") + "'] .priority")
            .removeClass("active");

        $.post("/account/notifications/hide/", {
            notification: element.attr("data-id"),
            _csrf: window.config.csrf
        });
    },
    fileSearch: function(search) {
        window.location.href = "/documents/search/" + encodeURI(search) + "/";
    }
}
